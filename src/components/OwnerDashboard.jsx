import React, { useState } from 'react'
import {
  TrendingUp,
  Boxes,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Plus,
  ShieldCheck,
  Building2,
  ArrowRight,
  Printer,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react'
import { store } from '../services/store'

export function OwnerDashboard({
  onOpenRestockReview,
  onOpenNewCustomer,
  onOpenPaymentRecord,
  onOpenDocumentPrint
}) {
  const [activeTab, setActiveTab] = useState('approvals') // 'approvals', 'inventory', 'credit', 'sales'
  const [salesSearch, setSalesSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('ALL')

  // Stock Across All Shops Filter & Sort State
  const [stockSearchQuery, setStockSearchQuery] = useState('')
  const [stockCategoryFilter, setStockCategoryFilter] = useState('ALL')
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL') // 'ALL', 'LOW_STOCK', 'HEALTHY'
  const [stockSortBy, setStockSortBy] = useState('name') // 'name', 'category', 'price', 'wh', 'medie', 'lapaz', 'kumasi', 'total'
  const [stockSortDir, setStockSortDir] = useState('asc')

  const toggleStockSort = (columnKey) => {
    if (stockSortBy === columnKey) {
      setStockSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setStockSortBy(columnKey)
      setStockSortDir('asc')
    }
  }

  const handleCardClick = (tabKey) => {
    setActiveTab(tabKey)
    setTimeout(() => {
      const panel = document.getElementById('owner-content-panel')
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const top = panel.getBoundingClientRect().top + window.pageYOffset - 16
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 80)
  }

  // Calculate High-Level Metrics
  const warehouse = store.getWarehouseLocation()
  const retailLocations = store.locations.filter((l) => l.type === 'branch')

  // 1. Total Inventory Valuation
  let totalInventoryValuation = 0
  let totalLowStockCount = 0

  store.locations.forEach((loc) => {
    store.products.forEach((prod) => {
      const qty = store.getProductStock(loc.id, prod.id)
      totalInventoryValuation += qty * prod.unit_price
      if (qty <= prod.low_stock_threshold) {
        totalLowStockCount += 1
      }
    })
  })

  // 2. Total Credit Outstanding & Customer Balances
  let totalCreditOutstanding = 0
  let totalPurchasesAllTime = 0
  let totalPaidAllTime = 0

  const customerBalanceList = store.customers.map((c) => {
    const balData = store.getCustomerBalance(c.id)
    totalCreditOutstanding += balData.balance
    totalPurchasesAllTime += balData.totalPurchases
    totalPaidAllTime += balData.totalPaid
    return {
      ...c,
      ...balData
    }
  })

  // 3. Today's Revenue (and total sales)
  const totalSalesRevenue = store.sales.reduce((sum, s) => sum + s.total_amount, 0)
  const pendingTransfers = store.stockTransfers.filter((t) => t.status === 'pending_approval')

  // Filtered Sales
  const filteredSales = store.sales.filter((sale) => {
    const matchesSearch =
      sale.customer_name.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.location_name.toLowerCase().includes(salesSearch.toLowerCase())

    const matchesBranch = branchFilter === 'ALL' || sale.location_id === branchFilter
    return matchesSearch && matchesBranch
  })

  // Categories for Stock Table Filter
  const stockCategories = ['ALL', ...Array.from(new Set(store.products.map((p) => p.category))).sort()]

  // Filtered and Sorted Stock across all locations - Default: Product Name (A-Z) then Category
  const filteredOwnerStock = store.products
    .map((p) => {
      const whQty = store.getProductStock(warehouse.id, p.id)
      const medieQty = store.getProductStock('22222222-2222-2222-2222-222222222222', p.id)
      const lapazQty = store.getProductStock('33333333-3333-3333-3333-333333333333', p.id)
      const kumasiQty = store.getProductStock('44444444-4444-4444-4444-444444444444', p.id)
      const total = whQty + medieQty + lapazQty + kumasiQty
      const isAnyLow =
        medieQty <= p.low_stock_threshold ||
        lapazQty <= p.low_stock_threshold ||
        kumasiQty <= p.low_stock_threshold
      return {
        ...p,
        whQty,
        medieQty,
        lapazQty,
        kumasiQty,
        total,
        isAnyLow
      }
    })
    .filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(stockSearchQuery.toLowerCase()))
      const matchCat = stockCategoryFilter === 'ALL' || item.category === stockCategoryFilter
      const matchStatus =
        stockStatusFilter === 'ALL' ||
        (stockStatusFilter === 'LOW_STOCK' && item.isAnyLow) ||
        (stockStatusFilter === 'HEALTHY' && !item.isAnyLow)
      return matchSearch && matchCat && matchStatus
    })
    .sort((a, b) => {
      const mult = stockSortDir === 'asc' ? 1 : -1
      if (stockSortBy === 'name') {
        const cmp = a.name.localeCompare(b.name)
        if (cmp !== 0) return cmp * mult
        return a.category.localeCompare(b.category)
      }
      if (stockSortBy === 'category') {
        const cmp = a.category.localeCompare(b.category)
        if (cmp !== 0) return cmp * mult
        return a.name.localeCompare(b.name)
      }
      if (stockSortBy === 'price') {
        return (a.unit_price - b.unit_price) * mult
      }
      if (stockSortBy === 'wh') {
        return (a.whQty - b.whQty) * mult
      }
      if (stockSortBy === 'medie') {
        return (a.medieQty - b.medieQty) * mult
      }
      if (stockSortBy === 'lapaz') {
        return (a.lapazQty - b.lapazQty) * mult
      }
      if (stockSortBy === 'kumasi') {
        return (a.kumasiQty - b.kumasiQty) * mult
      }
      if (stockSortBy === 'total') {
        return (a.total - b.total) * mult
      }
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Owner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Owner Overview
            </span>
            <span className="text-xs text-slate-500 font-medium">Centric Systems Ghana Ltd</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Welcome back, Kwame Yeboah
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Overall business control for Central Warehouse and retail shops in Medie, Lapaz, and Kumasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenNewCustomer}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Open Pay Later Account
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - Tapping scrolls down to section on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Stock Requests from Branches */}
        <div
          onClick={() => handleCardClick('approvals')}
          role="button"
          tabIndex={0}
          className={`p-5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
            pendingTransfers.length > 0
              ? 'bg-amber-50/60 border-amber-300 hover:border-amber-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Requests</span>
            <div
              className={`p-2 rounded-xl ${
                pendingTransfers.length > 0
                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {pendingTransfers.length}
            </span>
            <span className={`text-xs font-bold ${pendingTransfers.length > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
              {pendingTransfers.length > 0 ? 'Waiting for Approval' : 'All Approved'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Check past branch sales before approving new stock.
          </p>
          <span className="text-[10px] text-amber-700 font-bold block sm:hidden mt-2">
            Tap to view requests ↓
          </span>
        </div>

        {/* Metric 2: Total Sales Made */}
        <div
          onClick={() => handleCardClick('sales')}
          role="button"
          tabIndex={0}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Made</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
              ₵{totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-emerald-800 font-bold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            From {store.sales.length} verified receipts across all shops.
          </p>
          <span className="text-[10px] text-emerald-700 font-bold block sm:hidden mt-2">
            Tap to view sales & receipts ↓
          </span>
        </div>

        {/* Metric 3: Total Stock Value */}
        <div
          onClick={() => handleCardClick('inventory')}
          role="button"
          tabIndex={0}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Total Stock Value</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700">
              ₵{totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-blue-800 font-bold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            In warehouse & 3 branches ({totalLowStockCount} items running low).
          </p>
          <span className="text-[10px] text-blue-700 font-bold block sm:hidden mt-2">
            Tap to view stock across shops ↓
          </span>
        </div>

        {/* Metric 4: Unpaid Customer Bills (Buy Now, Pay Later) */}
        <div
          onClick={() => handleCardClick('credit')}
          role="button"
          tabIndex={0}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Unpaid Pay Later Invoices</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-800">
              ₵{totalCreditOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              GHS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Total goods taken upfront by registered contractors awaiting payment settlement.
          </p>
          <span className="text-[10px] text-amber-800 font-bold block sm:hidden mt-2">
            Tap to view customer balances ↓
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar Container - target for scroll down */}
      <div id="owner-content-panel" className="scroll-mt-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Tab 1: Matches Card 1 (Stock Requests) */}
          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'approvals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            Approve Restock
            {pendingTransfers.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'approvals' ? 'bg-white text-emerald-800' : 'bg-amber-500 text-white'
              }`}>
                {pendingTransfers.length}
              </span>
            )}
          </button>

          {/* Tab 2: Matches Card 2 (Total Sales Made) */}
          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'sales'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            All Sales & Receipts
          </button>

          {/* Tab 3: Matches Card 3 (Total Stock Value) */}
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
            Check Stock Across All Shops
          </button>

          {/* Tab 4: Matches Card 4 (Unpaid Pay Later Invoices) */}
          <button
            type="button"
            onClick={() => setActiveTab('credit')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'credit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Pay Later Accounts
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: Approve Restock & Sales Verification */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Pending Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  Stock Requests from Branches (Waiting for Approval)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Click on any request to check previous 30-day branch sales and customer names before approving.
                </p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border self-start sm:self-auto shrink-0 ${
                pendingTransfers.length > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {pendingTransfers.length} Action{pendingTransfers.length === 1 ? '' : 's'} Needed
              </span>
            </div>

            {pendingTransfers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5">
                {pendingTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                          {transfer.to_name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Requested on {new Date(transfer.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-slate-800 font-medium">
                        <strong className="text-slate-900 font-bold">Requested Items:</strong>{' '}
                        {transfer.items
                          .map((i) => `${i.quantity_requested}x ${i.product_name}`)
                          .join(', ')}
                      </div>

                      {transfer.notes && (
                        <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                          <strong>Clerk reason:</strong> "{transfer.notes}"
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => onOpenRestockReview(transfer)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Check Past Sales & Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                All branch stock requests have been reviewed. There are no pending approvals.
              </div>
            )}
          </div>

          {/* Transfer History / In-Transit Pipeline */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Approved, On the Way & Completed Stock Deliveries
            </h3>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Destination Shop</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Delivery Waybill / Driver</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {store.stockTransfers
                    .filter((t) => t.status !== 'pending_approval')
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                            {t.to_name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {t.items
                            .map((i) => `${i.quantity_approved || i.quantity_requested}x ${i.product_name}`)
                            .join(', ')}
                        </td>
                        <td className="py-3 px-4">
                          {t.waybill_number ? (
                            <div>
                              <span className="font-mono text-slate-900 font-medium">{t.waybill_number}</span>
                              <span className="block text-[11px] text-slate-500">
                                {t.driver_name} ({t.driver_phone})
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Waiting for delivery truck</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              t.status === 'received'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : t.status === 'dispatched'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : t.status === 'approved'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {t.status === 'received'
                              ? 'Delivered & Received'
                              : t.status === 'dispatched'
                                ? 'On The Way'
                                : t.status === 'approved'
                                  ? 'Approved (At Warehouse)'
                                  : 'Declined'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenRestockReview(t)}
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (Visible only on mobile) */}
            <div className="block md:hidden space-y-3">
              {store.stockTransfers
                .filter((t) => t.status !== 'pending_approval')
                .map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                        <span className="font-bold text-slate-900 text-sm">{t.to_name}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                          t.status === 'received'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : t.status === 'dispatched'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : t.status === 'approved'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {t.status === 'received'
                          ? 'Delivered'
                          : t.status === 'dispatched'
                            ? 'On The Way'
                            : t.status === 'approved'
                              ? 'Approved'
                              : 'Declined'}
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Items in Shipment:</span>
                      <div className="space-y-1">
                        {t.items.map((i, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs">
                            <span className="font-bold text-emerald-800 font-mono shrink-0">{i.quantity_approved || i.quantity_requested}x</span>
                            <span className="truncate">{i.product_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waybill & Driver:</span>
                      {t.waybill_number ? (
                        <div className="mt-0.5">
                          <span className="font-mono text-slate-900 font-bold block">{t.waybill_number}</span>
                          <span className="text-[11px] text-slate-600 block">
                            {t.driver_name} ({t.driver_phone})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Waiting for delivery truck</span>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenRestockReview(t)}
                        className="w-full py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors text-center"
                      >
                        View Verification Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Check Stock Across All Shops */}
      

      {activeTab === 'sales' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">All Branch Sales & Receipts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every customer invoice issued across Medie, Lapaz, and Kumasi retail points.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Branch Filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="ALL">All Branches</option>
                {retailLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer or branch..."
                  value={salesSearch}
                  onChange={(e) => setSalesSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Branch Shop</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Items Sold</th>
                  <th className="py-3 px-4 text-right">Amount (GHS)</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {new Date(sale.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{sale.location_name}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{sale.customer_name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {sale.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sale.payment_mode === 'credit'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {sale.payment_mode === 'credit' ? 'Pay Later' : sale.payment_mode === 'momo' ? 'MoMo' : 'Cash'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDocumentPrint(sale)}
                        title="Print Official Receipt / Invoice"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium text-xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-700" />
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Visible only on mobile) */}
          <div className="block md:hidden space-y-3">
            {filteredSales.map((sale) => (
              <div key={sale.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {sale.customer_name}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sale.payment_mode === 'credit'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {sale.payment_mode === 'credit' ? 'Pay Later' : sale.payment_mode === 'momo' ? 'MoMo' : 'Cash'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-500">
                    {sale.location_name} • {new Date(sale.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="font-mono font-extrabold text-slate-950 text-sm">
                    ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
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
                    Print Official Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Stock Levels Across All Shops</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
                  {filteredOwnerStock.length} of {store.products.length} products
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordered by Product Name then Category by default. Click any column header to sort, or filter by category and stock alert status.
              </p>
            </div>
          </div>

          {/* Search, Filter & Order Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name or code..."
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <select
              value={stockCategoryFilter}
              onChange={(e) => setStockCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
            >
              <option value="ALL">All Categories</option>
              {stockCategories.filter((c) => c !== 'ALL').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="LOW_STOCK">⚠️ Low Stock in Any Shop</option>
              <option value="HEALTHY">✓ Adequate Stock</option>
            </select>

            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] text-slate-500 font-medium">Order by:</span>
              <select
                value={stockSortBy}
                onChange={(e) => setStockSortBy(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
              >
                <option value="name">Product Name (A-Z then Category)</option>
                <option value="category">Category</option>
                <option value="price">Unit Price</option>
                <option value="wh">Central Warehouse Units</option>
                <option value="medie">Centric Medie Units</option>
                <option value="lapaz">Centric Lapaz Units</option>
                <option value="kumasi">Centric Kumasi Units</option>
                <option value="total">Total Company Units</option>
              </select>
              <button
                type="button"
                onClick={() => setStockSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className="px-2.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                title="Toggle sort direction"
              >
                {stockSortDir === 'asc' ? 'Asc ▲' : 'Desc ▼'}
              </button>
            </div>
          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 select-none">
                  <th
                    onClick={() => toggleStockSort('name')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Product Name</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'name' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('category')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'category' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('price')}
                    className="py-3 px-4 text-right font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Unit Price</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'price' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('wh')}
                    className="py-3 px-4 text-center font-semibold text-blue-700 bg-blue-50/50 cursor-pointer hover:bg-blue-100/60 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Central Warehouse</span>
                      <span className="font-bold">
                        {stockSortBy === 'wh' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('medie')}
                    className="py-3 px-4 text-center font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Centric Medie</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'medie' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('lapaz')}
                    className="py-3 px-4 text-center font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Centric Lapaz</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'lapaz' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('kumasi')}
                    className="py-3 px-4 text-center font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Centric Kumasi</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'kumasi' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => toggleStockSort('total')}
                    className="py-3 px-4 text-center font-bold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Total Units</span>
                      <span className="text-emerald-700 font-bold">
                        {stockSortBy === 'total' ? (stockSortDir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOwnerStock.length > 0 ? (
                  filteredOwnerStock.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900 font-medium">
                        ₵{p.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-blue-700 bg-blue-50/40">
                        {p.whQty}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            p.medieQty <= p.low_stock_threshold
                              ? 'text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200'
                              : 'text-slate-700'
                          }
                        >
                          {p.medieQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            p.lapazQty <= p.low_stock_threshold
                              ? 'text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200'
                              : 'text-slate-700'
                          }
                        >
                          {p.lapazQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            p.kumasiQty <= p.low_stock_threshold
                              ? 'text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200'
                              : 'text-slate-700'
                          }
                        >
                          {p.kumasiQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-950">
                        {p.total}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      No stock items match the selected filter or search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Visible only on mobile) */}
          <div className="block md:hidden space-y-3">
            {filteredOwnerStock.length > 0 ? (
              filteredOwnerStock.map((p) => {
                const hasLowStockBranch =
                  p.medieQty <= p.low_stock_threshold ||
                  p.lapazQty <= p.low_stock_threshold ||
                  p.kumasiQty <= p.low_stock_threshold

                return (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{p.name}</h4>
                        <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                          {p.category}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ₵{p.unit_price.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </span>
                        <span className="text-[10px] text-slate-500 block">Unit Price</span>
                      </div>
                    </div>

                    {hasLowStockBranch && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold">One or more retail shops running low</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-200">
                        <span className="text-[10px] uppercase font-bold text-blue-700 block">Central Warehouse</span>
                        <span className="font-mono text-sm font-extrabold text-blue-900">{p.whQty} units</span>
                      </div>
                      <div
                        className={`p-2 rounded-lg border ${
                          p.medieQty <= p.low_stock_threshold
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-600">Medie Shop</span>
                          {p.medieQty <= p.low_stock_threshold && (
                            <span className="text-[9px] font-bold text-rose-700 uppercase">Low</span>
                          )}
                        </div>
                        <span
                          className={`font-mono text-sm font-extrabold ${
                            p.medieQty <= p.low_stock_threshold ? 'text-rose-700' : 'text-slate-800'
                          }`}
                        >
                          {p.medieQty} units
                        </span>
                      </div>
                      <div
                        className={`p-2 rounded-lg border ${
                          p.lapazQty <= p.low_stock_threshold
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-600">Lapaz Shop</span>
                          {p.lapazQty <= p.low_stock_threshold && (
                            <span className="text-[9px] font-bold text-rose-700 uppercase">Low</span>
                          )}
                        </div>
                        <span
                          className={`font-mono text-sm font-extrabold ${
                            p.lapazQty <= p.low_stock_threshold ? 'text-rose-700' : 'text-slate-800'
                          }`}
                        >
                          {p.lapazQty} units
                        </span>
                      </div>
                      <div
                        className={`p-2 rounded-lg border ${
                          p.kumasiQty <= p.low_stock_threshold
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-600">Kumasi Shop</span>
                          {p.kumasiQty <= p.low_stock_threshold && (
                            <span className="text-[9px] font-bold text-rose-700 uppercase">Low</span>
                          )}
                        </div>
                        <span
                          className={`font-mono text-sm font-extrabold ${
                            p.kumasiQty <= p.low_stock_threshold ? 'text-rose-700' : 'text-slate-800'
                          }`}
                        >
                          {p.kumasiQty} units
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-600 font-medium">Total Company Stock:</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{p.total} units</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-8 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200">
                No items match your filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Customer Pay Later Accounts & Unpaid Bills */}
      

      {activeTab === 'credit' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Customer Pay Later Accounts (Buy Now, Pay Later)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record contractor bill settlements and track how much each customer currently owes for goods taken upfront.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenNewCustomer}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Open Pay Later Account
              </button>
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">Customer / Contractor</th>
                    <th className="py-3 px-4">Phone & TIN</th>
                    <th className="py-3 px-4 text-right">Total Purchases (Billed)</th>
                    <th className="py-3 px-4 text-right">Total Payments Settled</th>
                    <th className="py-3 px-4 text-right text-rose-700">Current Unpaid Balance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customerBalanceList.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{cust.full_name}</div>
                        <div className="text-[11px] text-slate-500">{cust.company_name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-slate-800">{cust.phone}</div>
                        <div className="text-slate-400">{cust.tin_number || 'No TIN'}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        ₵{cust.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                        ₵{cust.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                        ₵{cust.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenPaymentRecord(cust)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          Settle Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (Visible only on mobile) */}
            <div className="block md:hidden space-y-3">
              {customerBalanceList.map((cust) => (
                <div key={cust.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cust.full_name}</h4>
                    <span className="text-[11px] text-slate-500 block">{cust.company_name || 'Contractor'}</span>
                    <span className="text-[11px] font-mono text-slate-600">{cust.phone} • {cust.tin_number || 'No TIN'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Total Billed</span>
                      <span className="font-mono font-semibold text-slate-800 text-[11px]">
                        ₵{cust.totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Paid</span>
                      <span className="font-mono font-semibold text-emerald-700 text-[11px]">
                        ₵{cust.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-rose-700 block">Owed</span>
                      <span className="font-mono font-extrabold text-rose-700 text-xs">
                        ₵{cust.balance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenPaymentRecord(cust)}
                    className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                  >
                    Settle Bill
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: All Sales & Receipts */}
      
    </div>
  )
}
