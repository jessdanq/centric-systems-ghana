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
import { showNotification } from '../context/ToastContext'

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
  const [taxRate, setTaxRate] = useState(0) // Default 0
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
      setPosError(`Cannot exceed branch shelf stock of ${item.max_stock} units.`)
      return
    }

    setCart(
      cart.map((i) => (i.product_id === productId ? { ...i, quantity: newQty } : i))
    )
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

    // Verify customer selected if Buy Now Pay Later chosen (no artificial limits - billed directly)
    if (paymentMode === 'credit') {
      if (!selectedCustomerId) {
        setPosError('Please select a registered customer for Buy Now, Pay Later transactions.')
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

      setPosSuccessMsg('Sale completed successfully!')
      showNotification(`Sale of ₵${(Number(amountTendered) || cartTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })} completed successfully!`)
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
      showNotification('Stock successfully received and added to branch inventory!')
    } catch (err) {
      showNotification(`Error receiving stock: ${err.message}`, 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Branch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Retail Branch
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">{branchLocation.code}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            {branchLocation.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{branchLocation.address}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenRequestRestock}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Boxes className="w-4 h-4" />
            Ask for More Stock from Warehouse
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'pos'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Make a Sale
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'inventory'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Check Branch Stock
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'transfers'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          Incoming Deliveries
          {incomingTransfers.filter((t) => t.status === 'dispatched').length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'transfers' ? 'bg-white text-emerald-800' : 'bg-blue-600 text-white'
            }`}>
              {incomingTransfers.filter((t) => t.status === 'dispatched').length} on the way
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'sales'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Past Sales ({branchSales.length})
        </button>
      </div>

      {/* TAB 1: MAKE A SALE */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Categories */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
                    className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs cursor-pointer active:scale-[0.99]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          {product.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isOutOfStock
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : product.isLowStock
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isOutOfStock
                            ? 'Out of Stock'
                            : product.isLowStock
                              ? `Low: ${product.quantity} left`
                              : `${product.quantity} in stock`}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-extrabold font-mono text-emerald-700">
                        ₵{product.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>

                      {inCart ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
                          {inCart.quantity} in cart
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors disabled:opacity-30"
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
          <div id="pos-cart-panel" className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Current Cart</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-mono font-bold text-slate-800">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.reduce((sum, i) => sum + i.quantity, 0) === 1 ? '' : 's'}
                  </span>
                </div>

                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>

              {/* Error & Success Messages */}
              {posError && (
                <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{posError}</span>
                </div>
              )}

              {posSuccessMsg && (
                <div className="p-3 text-xs rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{posSuccessMsg}</span>
                </div>
              )}

              {/* Customer Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Customer Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId('')
                      setPaymentMode('cash')
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      !selectedCustomerId
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Pay Now (Cash / MoMo)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId(store.customers[0]?.id || '')
                      setPaymentMode('credit')
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedCustomerId
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Buy Now, Pay Later
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
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                ) : (
                  /* If Credit Customer */
                  <div className="space-y-2 mt-2">
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      {store.customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.company_name || c.phone})
                        </option>
                      ))}
                    </select>

                    {selectedCustomerData && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Current Unpaid Balance:</span>
                          <span className="font-mono font-bold text-rose-700">
                            ₵{selectedCustomerData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Total Past Purchases:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            ₵{selectedCustomerData.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-200">
                          This purchase will be charged to customer's account upon checkout.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.product_id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.product_name}</p>
                        <span className="text-[11px] font-mono text-slate-500">
                          ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product_id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product_id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right font-mono font-bold text-xs text-emerald-700 min-w-[70px]">
                        ₵{(item.quantity * item.unit_price).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 italic">
                    Cart is empty. Click products from the catalog to add.
                  </div>
                )}
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                      paymentMode === 'cash'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('momo')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                      paymentMode === 'momo'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Pay Later
                  </button>
                </div>
              </div>

              {/* Order Financial Totals */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900 font-medium">
                    ₵{cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Total Due:</span>
                  <span className="text-xl font-mono text-emerald-700">
                    GHS ₵{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Complete Sale Action */}
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleProcessSale}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Sale & Print Receipt
              </button>
            </div>
          </div>

          {/* Sticky Mobile Checkout Bar (visible on small screens when cart has items) */}
          {cart.length > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl z-40 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.reduce((sum, i) => sum + i.quantity, 0) === 1 ? '' : 's'} in cart
                </span>
                <span className="text-sm font-extrabold font-mono text-emerald-800">
                  ₵{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} GHS
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('pos-cart-panel')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Go to Cart →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BRANCH INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Branch Shelf Stock Levels</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Items marked with red badges are running low. Ask Central Warehouse for more stock.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRequestRestock}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs transition-all shadow-xs active:scale-95"
            >
              <Boxes className="w-3.5 h-3.5" />
              Ask for More Stock
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Shelf Stock</th>
                  <th className="py-3 px-4 text-center">Min Threshold</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branchStockList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                      <span className={item.isLowStock ? 'text-rose-700' : 'text-emerald-700'}>
                        {item.quantity} {item.unit_of_measure}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {item.low_stock_threshold}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900 font-medium">
                      ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.isLowStock
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.isLowStock ? 'Low Stock' : 'Good'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.isLowStock && (
                        <button
                          type="button"
                          onClick={onOpenRequestRestock}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold"
                        >
                          Ask for Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-3">
            {branchStockList.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h4>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">{item.category}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      item.isLowStock
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {item.isLowStock ? 'Low Stock' : 'Good'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Shelf Quantity</span>
                    <span className={`font-mono text-sm font-extrabold ${item.isLowStock ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {item.quantity} {item.unit_of_measure}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Threshold: {item.low_stock_threshold}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Unit Selling Price</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {item.isLowStock && (
                  <button
                    type="button"
                    onClick={onOpenRequestRestock}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Request Stock Restock from Warehouse
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INCOMING DELIVERIES */}
      {activeTab === 'transfers' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Incoming Deliveries from Central Warehouse</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                When the delivery truck arrives physically at this branch, click "Delivery Truck Arrived / Confirm Goods Received".
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {incomingTransfers.length > 0 ? (
              incomingTransfers.map((transfer) => {
                const isDispatched = transfer.status === 'dispatched'
                const isApproved = transfer.status === 'approved'
                const isPending = transfer.status === 'pending_approval'
                const isReceived = transfer.status === 'received'

                return (
                  <div
                    key={transfer.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          Requested on {new Date(transfer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isReceived
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isDispatched
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : isApproved
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isReceived
                            ? 'Delivered & Received'
                            : isDispatched
                              ? 'On the Way (Dispatched)'
                              : isApproved
                                ? 'Approved by Owner'
                                : 'Waiting for Review'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-900 font-bold">
                        Items:{' '}
                        <span className="font-medium text-slate-700">
                          {transfer.items
                            .map((i) => `${i.quantity_approved || i.quantity_requested}x ${i.product_name}`)
                            .join(', ')}
                        </span>
                      </div>

                      {transfer.waybill_number && (
                        <div className="text-xs text-blue-800 font-mono flex items-center gap-2 bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          Waybill: {transfer.waybill_number} | Driver: {transfer.driver_name} ({transfer.driver_phone})
                        </div>
                      )}

                      {transfer.notes && (
                        <p className="text-xs text-slate-500 italic">Branch note: "{transfer.notes}"</p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                      {isDispatched && (
                        <button
                          type="button"
                          onClick={() => handleConfirmReceipt(transfer.id)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Delivery Truck Arrived / Confirm Goods Received
                        </button>
                      )}

                      {isApproved && (
                        <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold">
                          Approved — Warehouse is loading goods
                        </span>
                      )}

                      {isPending && (
                        <span className="text-xs text-slate-500 italic">
                          Waiting for Owner Review (Kwame Yeboah)
                        </span>
                      )}

                      {isReceived && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          Added to Shelf Inventory
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                No delivery records found for this branch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BRANCH SALES HISTORY */}
      {activeTab === 'sales' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Branch Sales History</h2>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Sold</th>
                  <th className="py-3 px-4 text-right">Amount (GHS)</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branchSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {new Date(sale.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{sale.customer_name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {sale.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {sale.payment_mode === 'credit' ? 'Pay Later' : sale.payment_mode === 'momo' ? 'MoMo' : 'Cash'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDocumentPrint(sale)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-3">
            {branchSales.map((sale) => (
              <div key={sale.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {sale.customer_name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-white text-slate-700 border border-slate-200">
                    {sale.payment_mode === 'credit' ? 'Pay Later' : sale.payment_mode === 'momo' ? 'MoMo' : 'Cash'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500">
                    {new Date(sale.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-slate-950 text-sm">
                      ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-400 block text-[10px] uppercase mb-0.5">Items Sold:</span>
                  {sale.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenDocumentPrint(sale)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    Print Receipt / Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
