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
      sale.invoice_number.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.customer_name.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.location_name.toLowerCase().includes(salesSearch.toLowerCase())

    const matchesBranch = branchFilter === 'ALL' || sale.location_id === branchFilter
    return matchesSearch && matchesBranch
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Stock Requests from Branches */}
        <div
          onClick={() => setActiveTab('approvals')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
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
        </div>

        {/* Metric 2: Total Sales Made */}
        <div
          onClick={() => setActiveTab('sales')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-all"
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
        </div>

        {/* Metric 3: Total Stock Value */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-all"
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
        </div>

        {/* Metric 4: Unpaid Customer Bills (Buy Now, Pay Later) */}
        <div
          onClick={() => setActiveTab('credit')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer transition-all"
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
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Check Stock Across All Shops
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('credit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'credit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Pay Later Accounts & Unpaid Bills
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sales'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          All Sales & Receipts
        </button>
      </div>

      {/* TAB CONTENT 1: Approve Restock & Sales Verification */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Pending Section */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Stock Requests from Branches (Waiting for Approval)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Click on any request to check previous 30-day branch sales and customer names before approving.
                </p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                pendingTransfers.length > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {pendingTransfers.length} Action Needed
              </span>
            </div>

            {pendingTransfers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5">
                {pendingTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {transfer.transfer_number}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {transfer.to_name}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {new Date(transfer.created_at).toLocaleDateString('en-GB', {
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

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Request #</th>
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
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          {t.transfer_number}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{t.to_name}</td>
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
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Check Stock Across All Shops */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Stock Levels Across All Shops
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Suppliers deliver only to Central Warehouse in Spintex. Goods are sent out to Medie, Lapaz, and Kumasi upon your approval.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Product Name</th>
                  <th className="py-3 px-4 font-semibold">SKU / Category</th>
                  <th className="py-3 px-4 text-right font-semibold">Unit Price</th>
                  <th className="py-3 px-4 text-center font-semibold text-blue-700 bg-blue-50/50">Central Warehouse</th>
                  <th className="py-3 px-4 text-center font-semibold">Centric Medie</th>
                  <th className="py-3 px-4 text-center font-semibold">Centric Lapaz</th>
                  <th className="py-3 px-4 text-center font-semibold">Centric Kumasi</th>
                  <th className="py-3 px-4 text-center font-bold text-slate-900">Total Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {store.products.map((p) => {
                  const whQty = store.getProductStock(warehouse.id, p.id)
                  const medieQty = store.getProductStock('22222222-2222-2222-2222-222222222222', p.id)
                  const lapazQty = store.getProductStock('33333333-3333-3333-3333-333333333333', p.id)
                  const kumasiQty = store.getProductStock('44444444-4444-4444-4444-444444444444', p.id)
                  const total = whQty + medieQty + lapazQty + kumasiQty

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {p.sku} <span className="text-slate-400">({p.category})</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900 font-medium">
                        ₵{p.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-blue-700 bg-blue-50/40">
                        {whQty}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            medieQty <= p.low_stock_threshold
                              ? 'text-rose-700 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200'
                              : 'text-slate-800'
                          }
                        >
                          {medieQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            lapazQty <= p.low_stock_threshold
                              ? 'text-rose-700 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200'
                              : 'text-slate-800'
                          }
                        >
                          {lapazQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            kumasiQty <= p.low_stock_threshold
                              ? 'text-rose-700 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200'
                              : 'text-slate-800'
                          }
                        >
                          {kumasiQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-900">
                        {total}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
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
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: All Sales & Receipts */}
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
                  placeholder="Search receipt # or customer..."
                  value={salesSearch}
                  onChange={(e) => setSalesSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Branch Shop</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Items Sold</th>
                  <th className="py-3 px-4 text-right">Amount (GHS)</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {sale.invoice_number}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
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
        </div>
      )}
    </div>
  )
}
