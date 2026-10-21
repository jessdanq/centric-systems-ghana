import React, { useState } from 'react'
import {
  ShoppingCart,
  Boxes,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Building2,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  ArrowRight,
  ShieldAlert,
  Percent
} from 'lucide-react'
import { store } from '../services/store'

export function BranchDashboard({
  currentUser,
  onOpenDocumentPrint,
  onOpenRequestRestock
}) {
  const [activeTab, setActiveTab] = useState('pos') // 'pos', 'inventory', 'transfers', 'sales'

  // POS State
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [walkinName, setWalkinName] = useState('Walk-in Customer')
  const [walkinPhone, setWalkinPhone] = useState('')
  const [paymentMode, setPaymentMode] = useState('cash')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [taxRate, setTaxRate] = useState(0) // Default 0 or GRA standard
  const [saleNotes, setSaleNotes] = useState('')
  const [amountTendered, setAmountTendered] = useState('')
  const [posError, setPosError] = useState('')
  const [posSuccessMsg, setPosSuccessMsg] = useState('')

  // Determine current branch location
  const branchLocation =
    store.locations.find((l) => l.id === currentUser.assigned_location_id) ||
    store.locations.find((l) => l.type === 'branch')

  const branchStockList = store.getLocationStockList(branchLocation.id)

  // Incoming transfers destined for this branch
  const incomingTransfers = store.stockTransfers.filter(
    (t) => t.to_location_id === branchLocation.id
  )

  // Branch sales
  const branchSales = store.sales.filter((s) => s.location_id === branchLocation.id)

  // Categories
  const categories = ['ALL', ...new Set(store.products.map((p) => p.category))]

  // Filtered Products for POS
  const filteredProducts = branchStockList.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Selected Credit Customer Data
  const selectedCustomerData = selectedCustomerId
    ? store.getCustomerBalance(selectedCustomerId)
    : null

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const discountVal = Number(discountAmount) || 0
  const taxableSubtotal = Math.max(0, cartSubtotal - discountVal)
  const taxVal = (taxableSubtotal * (Number(taxRate) || 0)) / 100
  const cartTotal = taxableSubtotal + taxVal

  // Add Item to Cart (validates against local branch stock)
  const handleAddToCart = (product) => {
    setPosError('')
    const existing = cart.find((i) => i.product_id === product.id)
    const currentQtyInCart = existing ? existing.quantity : 0

    if (currentQtyInCart + 1 > product.quantity) {
      setPosError(
        `Cannot add more "${product.name}". Local branch shelf stock is only ${product.quantity} ${product.unit_of_measure}.`
      )
      return
    }

    if (existing) {
      setCart(
        cart.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          product_name: product.name,
          sku: product.sku,
          unit_price: product.unit_price,
          unit_of_measure: product.unit_of_measure,
          max_stock: product.quantity,
          quantity: 1
        }
      ])
    }
  }

  // Update Cart Quantity
  const handleUpdateQty = (productId, newQty) => {
    setPosError('')
    if (newQty <= 0) {
      setCart(cart.filter((i) => i.product_id !== productId))
      return
    }

    const item = cart.find((i) => i.product_id === productId)
    if (item && newQty > item.max_stock) {
      setPosError(`Cannot exceed branch stock of ${item.max_stock} units.`)
      return
    }

    setCart(
      cart.map((i) => (i.product_id === productId ? { ...i, quantity: newQty } : i))
    )
  }

  const handleRemoveItem = (productId) => {
    setCart(cart.filter((i) => i.product_id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
    setPosError('')
    setDiscountAmount(0)
    setAmountTendered('')
  }

  // Complete Sale
  const handleProcessSale = () => {
    setPosError('')
    setPosSuccessMsg('')

    if (cart.length === 0) {
      setPosError('Cart is empty. Please add items to complete sale.')
      return
    }

    // Verify credit limit if credit chosen
    if (paymentMode === 'credit') {
      if (!selectedCustomerId) {
        setPosError('Please select a registered commercial customer for Credit transactions.')
        return
      }
      if (selectedCustomerData && cartTotal > selectedCustomerData.available) {
        setPosError(
          `Credit limit exceeded! Customer's available credit is ₵${selectedCustomerData.available.toLocaleString(
            'en-US',
            { minimumFractionDigits: 2 }
          )}, but this order total is ₵${cartTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}.`
        )
        return
      }
    }

    try {
      const customer = selectedCustomerId
        ? store.customers.find((c) => c.id === selectedCustomerId)
        : null

      const newSale = store.createSale({
        locationId: branchLocation.id,
        customerId: selectedCustomerId || null,
        customerName: customer ? customer.full_name : walkinName || 'Walk-in Customer',
        customerPhone: customer ? customer.phone : walkinPhone || '',
        cashierName: currentUser.name,
        paymentMode,
        items: cart,
        discount: discountVal,
        taxRate,
        notes: saleNotes,
        amountPaid: Number(amountTendered) || cartTotal
      })

      setPosSuccessMsg(`Sale ${newSale.invoice_number} completed successfully!`)
      handleClearCart()

      // Prompt document modal immediately
      onOpenDocumentPrint(newSale)
    } catch (err) {
      setPosError(err.message)
    }
  }

  // Confirm Receipt of Restock Transfer
  const handleConfirmReceipt = (transferId) => {
    try {
      store.confirmReceiptTransfer(transferId, currentUser.name)
    } catch (err) {
      alert(`Error receiving stock: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Branch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Retail Branch Terminal
            </span>
            <span className="text-xs text-slate-400 font-mono">{branchLocation.code}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            {branchLocation.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{branchLocation.address}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenRequestRestock}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold transition-all"
          >
            <Boxes className="w-4 h-4" />
            Request Restock from Warehouse
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'pos'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Point of Sale (POS Terminal)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Branch Inventory & Requisitions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'transfers'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Truck className="w-4 h-4" />
          Incoming Restock Shipments
          {incomingTransfers.filter((t) => t.status === 'dispatched').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-slate-950 font-black text-[10px]">
              {incomingTransfers.filter((t) => t.status === 'dispatched').length} in-transit
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'sales'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          Branch Sales History ({branchSales.length})
        </button>
      </div>

      {/* TAB 1: POS TERMINAL */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Categories */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products or scan barcode/SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      categoryFilter === cat
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredProducts.map((product) => {
                const inCart = cart.find((i) => i.product_id === product.id)
                const isOutOfStock = product.quantity <= 0

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && handleAddToCart(product)}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 cursor-pointer shadow-sm hover:shadow-emerald-500/5 active:scale-[0.98]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          {product.sku}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isOutOfStock
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : product.isLowStock
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isOutOfStock
                            ? 'Out of Stock'
                            : product.isLowStock
                              ? `Low: ${product.quantity} left`
                              : `${product.quantity} in stock`}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-base font-extrabold font-mono text-emerald-400">
                        ₵{product.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>

                      {inCart ? (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
                          {inCart.quantity} in cart
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Active Cart & Checkout (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Current Cart</h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono font-bold text-emerald-400">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                  </span>
                </div>

                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>

              {/* Error & Success Messages */}
              {posError && (
                <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{posError}</span>
                </div>
              )}

              {posSuccessMsg && (
                <div className="p-3 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{posSuccessMsg}</span>
                </div>
              )}

              {/* Customer Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customer Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId('')
                      setPaymentMode('cash')
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      !selectedCustomerId
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Walk-in Direct
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId(store.customers[0]?.id || '')
                      setPaymentMode('credit')
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      selectedCustomerId
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Commercial Credit
                  </button>
                </div>

                {/* If Walk-in */}
                {!selectedCustomerId ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Customer Name (Optional)"
                      value={walkinName}
                      onChange={(e) => setWalkinName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  /* If Credit Customer */
                  <div className="space-y-2 mt-2">
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {store.customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.company_name || c.phone})
                        </option>
                      ))}
                    </select>

                    {selectedCustomerData && (
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Credit Limit:</span>
                          <span className="font-mono text-white">
                            ₵{selectedCustomerData.limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Outstanding Debt:</span>
                          <span className="font-mono text-rose-400">
                            ₵{selectedCustomerData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                          <span>Available Credit:</span>
                          <span
                            className={`font-mono font-bold ${
                              selectedCustomerData.available >= cartTotal
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}
                          >
                            ₵{selectedCustomerData.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/80 pr-1">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.product_id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.product_name}</p>
                        <span className="text-[11px] font-mono text-slate-400">
                          ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product_id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product_id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right font-mono font-bold text-xs text-emerald-400 min-w-[70px]">
                        ₵{(item.quantity * item.unit_price).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500 italic">
                    Cart is empty. Click products from the catalog to add.
                  </div>
                )}
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Payment Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                      paymentMode === 'cash'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('momo')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                      paymentMode === 'momo'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    disabled={!selectedCustomerId}
                    onClick={() => setPaymentMode('credit')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border disabled:opacity-40 ${
                      paymentMode === 'credit'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Credit Acct
                  </button>
                </div>
              </div>

              {/* Order Financial Totals */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">
                    ₵{cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-sm font-extrabold text-white">
                  <span>Total Due:</span>
                  <span className="text-xl font-mono text-emerald-400">
                    GHS ₵{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Complete Sale Action */}
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleProcessSale}
                className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Transaction & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANCH INVENTORY & REQUISITIONS */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Branch Shelf Inventory & Stock Levels</h2>
              <p className="text-xs text-slate-400">
                Items marked with red/amber badges require restocking from Central Warehouse.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRequestRestock}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Boxes className="w-3.5 h-3.5" />
              Requisition Restock
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Branch Shelf Count</th>
                  <th className="py-3 px-4 text-center">Min Threshold</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {branchStockList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.sku}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                      <span className={item.isLowStock ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.quantity} {item.unit_of_measure}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {item.low_stock_threshold}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white">
                      ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.isLowStock
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {item.isLowStock ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.isLowStock && (
                        <button
                          type="button"
                          onClick={onOpenRequestRestock}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold"
                        >
                          Request Restock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INCOMING RESTOCK SHIPMENTS */}
      {activeTab === 'transfers' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Incoming Stock Transfers from Central Warehouse</h2>
              <p className="text-xs text-slate-400">
                When goods arrive physically at this branch, click "Confirm Receipt" to increment local stock.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {incomingTransfers.length > 0 ? (
              incomingTransfers.map((transfer) => {
                const isDispatched = transfer.status === 'dispatched'
                const isApproved = transfer.status === 'approved'
                const isPending = transfer.status === 'pending_approval'
                const isReceived = transfer.status === 'received'

                return (
                  <div
                    key={transfer.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {transfer.transfer_number}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isReceived
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isDispatched
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                                : isApproved
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {transfer.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-white font-semibold">
                        Items:{' '}
                        {transfer.items
                          .map((i) => `${i.quantity_approved || i.quantity_requested}x ${i.product_name}`)
                          .join(', ')}
                      </div>

                      {transfer.waybill_number && (
                        <div className="text-xs text-blue-400 font-mono flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5" />
                          Waybill: {transfer.waybill_number} | Driver: {transfer.driver_name} ({transfer.driver_phone})
                        </div>
                      )}

                      {transfer.notes && (
                        <p className="text-xs text-slate-400 italic">Notes: "{transfer.notes}"</p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                      {isDispatched && (
                        <button
                          type="button"
                          onClick={() => handleConfirmReceipt(transfer.id)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Physical Receipt of Goods
                        </button>
                      )}

                      {isApproved && (
                        <span className="text-xs text-amber-400 font-semibold italic">
                          Awaiting Warehouse Logistics Dispatch
                        </span>
                      )}

                      {isPending && (
                        <span className="text-xs text-slate-400 italic">
                          Awaiting Owner Review (Kwame Yeboah)
                        </span>
                      )}

                      {isReceived && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Stock Added to Local Inventory
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
                No transfer records found for this branch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BRANCH SALES HISTORY */}
      {activeTab === 'sales' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Branch Sales Invoices Log</h2>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Sold</th>
                  <th className="py-3 px-4 text-right">Amount (GHS)</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Reprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {branchSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {sale.invoice_number}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(sale.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{sale.customer_name}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {sale.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        {sale.payment_mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDocumentPrint(sale)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
