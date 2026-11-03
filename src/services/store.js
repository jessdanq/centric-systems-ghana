import {
  LOCATIONS,
  DEMO_USERS,
  PRODUCTS,
  INITIAL_LOCATION_STOCK,
  CUSTOMERS,
  INITIAL_CREDIT_LEDGER,
  INITIAL_SALES,
  INITIAL_STOCK_TRANSFERS,
  SUPPLIER_INTAKES
} from '../data/initialData'

const STORAGE_KEY_PREFIX = 'centric_systems_gh_'

const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key)
    if (!item) return fallback
    return JSON.parse(item)
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err)
    return fallback
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data))
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err)
  }
}

const DATA_VERSION = 'v3_centric_gate_automation_45_items';

export class CentricStore {
  constructor() {
    const currentVersion = localStorage.getItem(STORAGE_KEY_PREFIX + 'data_version')
    if (currentVersion !== DATA_VERSION) {
      localStorage.clear()
      saveToStorage('data_version', DATA_VERSION)
      saveToStorage('locations', LOCATIONS)
      saveToStorage('products', PRODUCTS)
      saveToStorage('location_stock', INITIAL_LOCATION_STOCK)
      saveToStorage('customers', CUSTOMERS)
      saveToStorage('credit_ledger', INITIAL_CREDIT_LEDGER)
      saveToStorage('sales', INITIAL_SALES)
      saveToStorage('stock_transfers', INITIAL_STOCK_TRANSFERS)
      saveToStorage('supplier_intakes', SUPPLIER_INTAKES)
    }

    this.locations = loadFromStorage('locations', LOCATIONS)
    this.products = loadFromStorage('products', PRODUCTS)
    this.locationStock = loadFromStorage('location_stock', INITIAL_LOCATION_STOCK)
    this.customers = loadFromStorage('customers', CUSTOMERS)
    this.creditLedger = loadFromStorage('credit_ledger', INITIAL_CREDIT_LEDGER)
    this.sales = loadFromStorage('sales', INITIAL_SALES)
    this.stockTransfers = loadFromStorage('stock_transfers', INITIAL_STOCK_TRANSFERS)
    this.supplierIntakes = loadFromStorage('supplier_intakes', SUPPLIER_INTAKES)
    this.listeners = new Set()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach((listener) => listener())
  }

  resetToDefault() {
    localStorage.clear()
    this.locations = [...LOCATIONS]
    this.products = [...PRODUCTS]
    this.locationStock = [...INITIAL_LOCATION_STOCK]
    this.customers = [...CUSTOMERS]
    this.creditLedger = [...INITIAL_CREDIT_LEDGER]
    this.sales = [...INITIAL_SALES]
    this.stockTransfers = [...INITIAL_STOCK_TRANSFERS]
    this.supplierIntakes = [...SUPPLIER_INTAKES]

    saveToStorage('locations', this.locations)
    saveToStorage('products', this.products)
    saveToStorage('location_stock', this.locationStock)
    saveToStorage('customers', this.customers)
    saveToStorage('credit_ledger', this.creditLedger)
    saveToStorage('sales', this.sales)
    saveToStorage('stock_transfers', this.stockTransfers)
    saveToStorage('supplier_intakes', this.supplierIntakes)

    this.notify()
  }

  // --- Stock Queries ---
  getProductStock(locationId, productId) {
    const entry = this.locationStock.find(
      (s) => s.location_id === locationId && s.product_id === productId
    )
    return entry ? entry.quantity : 0
  }

  getLocationStockList(locationId) {
    return this.products.map((product) => {
      const quantity = this.getProductStock(locationId, product.id)
      const isLowStock = quantity <= product.low_stock_threshold
      return {
        ...product,
        quantity,
        isLowStock,
        total_value: quantity * product.unit_price
      }
    })
  }

  getWarehouseLocation() {
    return this.locations.find((l) => l.type === 'warehouse') || this.locations[0]
  }

  // --- Customer & Pay Later Balance Queries ---
  getCustomerBalance(customerId) {
    const customer = this.customers.find((c) => c.id === customerId)
    if (!customer) return { balance: 0, totalPurchases: 0, totalPaid: 0, totalDebits: 0, totalCredits: 0 }

    const ledger = this.creditLedger.filter((entry) => entry.customer_id === customerId)
    const totalDebits = ledger
      .filter((e) => e.entry_type === 'debit')
      .reduce((sum, e) => sum + Number(e.amount), 0)
    const totalCredits = ledger
      .filter((e) => e.entry_type === 'credit')
      .reduce((sum, e) => sum + Number(e.amount), 0)

    // Current unpaid bill balance
    const balance = Math.max(0, totalDebits - totalCredits)

    return {
      customer,
      balance,
      totalPurchases: totalDebits,
      totalPaid: totalCredits,
      totalDebits,
      totalCredits
    }
  }

  getCustomerLedger(customerId) {
    return this.creditLedger
      .filter((entry) => entry.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  // --- Owner Restock Verification: 30-Day Sales Audit ---
  getBranchRecentProductSales(locationId, productId, days = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const results = []

    this.sales.forEach((sale) => {
      if (sale.location_id === locationId && new Date(sale.created_at) >= cutoffDate) {
        sale.items.forEach((item) => {
          if (item.product_id === productId) {
            results.push({
              sale_id: sale.id,
              invoice_number: sale.invoice_number,
              sale_date: sale.created_at,
              customer_name: sale.customer_name || 'Walk-in Customer',
              customer_phone: sale.customer_phone || 'N/A',
              quantity_sold: item.quantity,
              unit_price: item.unit_price,
              subtotal: item.subtotal,
              payment_mode: sale.payment_mode
            })
          }
        })
      }
    })

    return results.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date))
  }

  // --- Transactions & Mutations ---

  // 1. Create Sale (POS)
  createSale({
    locationId,
    customerId,
    customerName,
    customerPhone,
    cashierName,
    paymentMode,
    items,
    discount = 0,
    taxRate = 0,
    notes = '',
    amountPaid = 0
  }) {
    // Validate stock at this location
    for (const item of items) {
      const currentStock = this.getProductStock(locationId, item.product_id)
      if (currentStock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${item.product_name}". Available: ${currentStock}, Requested: ${item.quantity}`
        )
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
    const discountAmount = Number(discount) || 0
    const taxableSubtotal = Math.max(0, subtotal - discountAmount)
    const taxAmount = (taxableSubtotal * (Number(taxRate) || 0)) / 100
    const totalAmount = taxableSubtotal + taxAmount

    // If payment is Pay Later, verify customer is selected (no limit restriction - billed directly to customer)
    if (paymentMode === 'credit') {
      if (!customerId) {
        throw new Error('Please select a registered customer for Buy Now, Pay Later.')
      }
    }

    const location = this.locations.find((l) => l.id === locationId)
    const branchCode = location?.code?.replace('BR-', '') || 'GEN'
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const invoiceNumber = `INV-${branchCode}-${new Date().getFullYear()}-${randomSuffix}`

    const newSale = {
      id: 's-' + Date.now(),
      invoice_number: invoiceNumber,
      location_id: locationId,
      location_name: location?.name || 'Branch',
      customer_id: customerId || null,
      customer_name: customerName || 'Walk-in Customer',
      customer_phone: customerPhone || '',
      cashier_name: cashierName || 'Staff',
      status: 'completed',
      payment_mode: paymentMode,
      subtotal,
      discount: discountAmount,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      amount_paid: paymentMode === 'credit' ? 0 : (amountPaid || totalAmount),
      change_due: Math.max(0, (amountPaid || totalAmount) - totalAmount),
      notes,
      created_at: new Date().toISOString(),
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        subtotal: Number(item.quantity) * Number(item.unit_price)
      }))
    }

    // Decrement local inventory
    items.forEach((item) => {
      const stockIdx = this.locationStock.findIndex(
        (s) => s.location_id === locationId && s.product_id === item.product_id
      )
      if (stockIdx !== -1) {
        this.locationStock[stockIdx].quantity -= Number(item.quantity)
      }
    })

    // If Credit sale, insert Debit row into credit_ledger
    if (paymentMode === 'credit' && customerId) {
      const ledgerEntry = {
        id: 'l-' + Date.now(),
        customer_id: customerId,
        sale_id: newSale.id,
        entry_type: 'debit',
        amount: totalAmount,
        payment_method: 'Invoice',
        reference_number: invoiceNumber,
        notes: `Credit Sale: ${items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}`,
        recorded_by_name: cashierName,
        created_at: new Date().toISOString()
      }
      this.creditLedger.unshift(ledgerEntry)
      saveToStorage('credit_ledger', this.creditLedger)
    }

    this.sales.unshift(newSale)
    saveToStorage('sales', this.sales)
    saveToStorage('location_stock', this.locationStock)
    this.notify()

    return newSale
  }

  // 2. Request Restock (Branch -> Central Warehouse)
  requestRestock({ fromLocationId, toLocationId, requestedByName, notes, items }) {
    const fromLoc = this.locations.find((l) => l.id === fromLocationId)
    const toLoc = this.locations.find((l) => l.id === toLocationId)
    const toCode = toLoc?.code?.replace('BR-', '') || 'LOC'
    const transferNumber = `TRF-${toCode}-${new Date().getFullYear()}-00${Math.floor(10 + Math.random() * 90)}`

    const newTransfer = {
      id: 't-' + Date.now(),
      transfer_number: transferNumber,
      from_location_id: fromLocationId,
      to_location_id: toLocationId,
      from_name: fromLoc?.name || 'Central Warehouse',
      to_name: toLoc?.name || 'Retail Branch',
      status: 'pending_approval',
      requested_by_name: requestedByName,
      notes,
      created_at: new Date().toISOString(),
      items: items.map((i) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        sku: i.sku,
        quantity_requested: Number(i.quantity_requested),
        quantity_approved: 0,
        quantity_dispatched: 0,
        quantity_received: 0
      }))
    }

    this.stockTransfers.unshift(newTransfer)
    saveToStorage('stock_transfers', this.stockTransfers)
    this.notify()
    return newTransfer
  }

  // 3. Approve Restock (Owner Kwame Yeboah)
  approveRestockTransfer(transferId, approvedItems, ownerNotes, approvedByName = 'Kwame Yeboah') {
    const transfer = this.stockTransfers.find((t) => t.id === transferId)
    if (!transfer) throw new Error('Transfer record not found')

    transfer.status = 'approved'
    transfer.approved_by_name = approvedByName
    transfer.owner_review_notes = ownerNotes
    transfer.approved_at = new Date().toISOString()

    // Update approved quantities
    transfer.items.forEach((item) => {
      const match = approvedItems.find((a) => a.product_id === item.product_id)
      if (match) {
        item.quantity_approved = Number(match.quantity_approved)
      } else {
        item.quantity_approved = item.quantity_requested
      }
    })

    saveToStorage('stock_transfers', this.stockTransfers)
    this.notify()
    return transfer
  }

  // 4. Reject Restock (Owner Kwame Yeboah)
  rejectRestockTransfer(transferId, reasonNotes, rejectedByName = 'Kwame Yeboah') {
    const transfer = this.stockTransfers.find((t) => t.id === transferId)
    if (!transfer) throw new Error('Transfer record not found')

    transfer.status = 'rejected'
    transfer.owner_review_notes = reasonNotes
    transfer.approved_by_name = rejectedByName
    transfer.updated_at = new Date().toISOString()

    saveToStorage('stock_transfers', this.stockTransfers)
    this.notify()
    return transfer
  }

  // 5. Dispatch Stock Transfer (Warehouse Manager Kofi Mensah)
  dispatchRestockTransfer(transferId, { dispatchedByName, waybillNumber, driverName, driverPhone, notes }) {
    const transfer = this.stockTransfers.find((t) => t.id === transferId)
    if (!transfer) throw new Error('Transfer record not found')
    if (transfer.status !== 'approved') {
      throw new Error('Transfer must be approved by Owner before warehouse dispatch.')
    }

    // Check warehouse has adequate stock
    for (const item of transfer.items) {
      const whStock = this.getProductStock(transfer.from_location_id, item.product_id)
      if (whStock < item.quantity_approved) {
        throw new Error(
          `Central Warehouse has insufficient stock for ${item.product_name}. Available: ${whStock}, Required: ${item.quantity_approved}`
        )
      }
    }

    transfer.status = 'dispatched'
    transfer.dispatched_by_name = dispatchedByName
    transfer.waybill_number = waybillNumber
    transfer.driver_name = driverName
    transfer.driver_phone = driverPhone
    transfer.dispatch_notes = notes
    transfer.dispatched_at = new Date().toISOString()

    transfer.items.forEach((item) => {
      item.quantity_dispatched = item.quantity_approved
    })

    saveToStorage('stock_transfers', this.stockTransfers)
    this.notify()
    return transfer
  }

  // 6. Confirm Receipt of Stock (Branch Staff)
  confirmReceiptTransfer(transferId, receivedByName) {
    const transfer = this.stockTransfers.find((t) => t.id === transferId)
    if (!transfer) throw new Error('Transfer record not found')
    if (transfer.status !== 'dispatched' && transfer.status !== 'approved') {
      throw new Error('Only dispatched or approved transfers can be received.')
    }

    // Atomic stock adjustment:
    // Decrement Central Warehouse Stock
    // Increment Branch Stock
    transfer.items.forEach((item) => {
      const qtyToMove = item.quantity_approved || item.quantity_requested

      // Warehouse decrement
      const whStock = this.locationStock.find(
        (s) => s.location_id === transfer.from_location_id && s.product_id === item.product_id
      )
      if (whStock) {
        whStock.quantity = Math.max(0, whStock.quantity - qtyToMove)
      }

      // Branch increment
      const branchStock = this.locationStock.find(
        (s) => s.location_id === transfer.to_location_id && s.product_id === item.product_id
      )
      if (branchStock) {
        branchStock.quantity += qtyToMove
      } else {
        this.locationStock.push({
          location_id: transfer.to_location_id,
          product_id: item.product_id,
          quantity: qtyToMove
        })
      }

      item.quantity_received = qtyToMove
    })

    transfer.status = 'received'
    transfer.received_by_name = receivedByName
    transfer.received_at = new Date().toISOString()

    saveToStorage('stock_transfers', this.stockTransfers)
    saveToStorage('location_stock', this.locationStock)
    this.notify()
    return transfer
  }

  // 7. Receive Supplier Intake (Central Warehouse ONLY)
  receiveSupplierIntake({ supplierName, supplierInvoiceRef, receivedByName, items, notes }) {
    const warehouse = this.getWarehouseLocation()
    const receiptNumber = `REC-SUP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

    let totalCost = 0
    const intakeItems = []

    items.forEach((item) => {
      const qty = Number(item.quantity)
      const cost = Number(item.unit_cost)
      const sub = qty * cost
      totalCost += sub

      // Increment Central Warehouse stock
      const whStock = this.locationStock.find(
        (s) => s.location_id === warehouse.id && s.product_id === item.product_id
      )
      if (whStock) {
        whStock.quantity += qty
      } else {
        this.locationStock.push({
          location_id: warehouse.id,
          product_id: item.product_id,
          quantity: qty
        })
      }

      intakeItems.push({
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: qty,
        unit_cost: cost,
        subtotal: sub
      })
    })

    const intakeRecord = {
      id: 'intake-' + Date.now(),
      receipt_number: receiptNumber,
      supplier_name: supplierName,
      supplier_invoice_ref: supplierInvoiceRef,
      received_by_name: receivedByName,
      warehouse_name: warehouse.name,
      date: new Date().toISOString(),
      total_cost: totalCost,
      notes,
      items: intakeItems
    }

    this.supplierIntakes.unshift(intakeRecord)
    saveToStorage('supplier_intakes', this.supplierIntakes)
    saveToStorage('location_stock', this.locationStock)
    this.notify()
    return intakeRecord
  }

  // 8. Record Customer Credit Payment (Double-Entry Credit)
  recordCreditPayment({ customerId, amount, paymentMethod, referenceNumber, notes, recordedByName }) {
    const amt = Number(amount)
    if (amt <= 0) throw new Error('Payment amount must be greater than zero')

    const newEntry = {
      id: 'l-' + Date.now(),
      customer_id: customerId,
      sale_id: null,
      entry_type: 'credit',
      amount: amt,
      payment_method: paymentMethod || 'MTN MoMo',
      reference_number: referenceNumber || `PAY-${Date.now().toString().slice(-6)}`,
      notes: notes || 'Debt settlement payment',
      recorded_by_name: recordedByName || 'Accounts Staff',
      created_at: new Date().toISOString()
    }

    this.creditLedger.unshift(newEntry)
    saveToStorage('credit_ledger', this.creditLedger)
    this.notify()
    return newEntry
  }

  // 9. Create New Pay Later Customer
  createCustomer({ fullName, phone, email, companyName, tinNumber, address, notes }) {
    const exists = this.customers.find((c) => c.phone === phone)
    if (exists) throw new Error(`A customer with phone number ${phone} already exists.`)

    const newCustomer = {
      id: 'c-' + Date.now(),
      full_name: fullName,
      phone,
      email: email || '',
      company_name: companyName || '',
      tin_number: tinNumber || '',
      address: address || '',
      is_active: true,
      notes: notes || '',
      created_at: new Date().toISOString()
    }

    this.customers.push(newCustomer)
    saveToStorage('customers', this.customers)
    this.notify()
    return newCustomer
  }
}

// Global Singleton Instance
export const store = new CentricStore()
