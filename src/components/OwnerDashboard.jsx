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
  let totalCreditCeiling = 0

  const customerBalanceList = store.customers.map((c) => {
    const balData = store.getCustomerBalance(c.id)
    totalCreditOutstanding += balData.balance
    totalCreditCeiling += balData.limit
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Executive View
            </span>
            <span className="text-xs text-slate-400 font-mono">Centric Systems Ghana Ltd</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Welcome back, Kwame Yeboah
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated enterprise control for Central Warehouse, Medie, Lapaz, and Kumasi retail branches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenNewCustomer}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Provision Credit Customer
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Restock Requisitions */}
        <div
          onClick={() => setActiveTab('approvals')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            pendingTransfers.length > 0
              ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Restock Requisitions</span>
            <div
              className={`p-2 rounded-xl ${
                pendingTransfers.length > 0
                  ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {pendingTransfers.length}
            </span>
            <span className="text-xs text-amber-400 font-semibold">Awaiting Owner Approval</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Requires 30-day branch sales audit prior to dispatch.
          </p>
        </div>

        {/* Metric 2: Total Sales Turnover */}
        <div
          onClick={() => setActiveTab('sales')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Recorded Sales Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              ₵{totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            From {store.sales.length} verified invoices across all shops.
          </p>
        </div>

        {/* Metric 3: Total Inventory Value */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Stock Asset Value</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              ₵{totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-blue-400 font-semibold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across Warehouse & 3 branches ({totalLowStockCount} low items).
          </p>
        </div>

        {/* Metric 4: Customer Credit Liability / Exposure */}
        <div
          onClick={() => setActiveTab('credit')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Credit Debt Exposure</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300">
              ₵{totalCreditOutstanding.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-slate-400">
              / ₵{(totalCreditCeiling / 1000).toFixed(0)}k cap
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {((totalCreditOutstanding / (totalCreditCeiling || 1)) * 100).toFixed(1)}% total credit utilization.
          </p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          Restock Approvals & Sales Audits
          {pendingTransfers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
              {pendingTransfers.length}
            </span>
          )}
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
          Multi-Branch Inventory Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('credit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'credit'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Customer Credit Ledgers & Limits
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
          Consolidated Sales & Invoices
        </button>
      </div>

      {/* TAB CONTENT 1: Restock Approvals & Sales Verification */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          {/* Pending Section */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Pending Restock Requisitions (Awaiting Owner Review)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click on any requisition to cross-reference previous 30-day branch sales with customer names before approving.
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {pendingTransfers.length} Action Needed
              </span>
            </div>

            {pendingTransfers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pendingTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {transfer.transfer_number}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {transfer.to_name}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">
                          {new Date(transfer.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300">
                        <strong>Requested Items:</strong>{' '}
                        {transfer.items
                          .map((i) => `${i.quantity_requested}x ${i.product_name}`)
                          .join(', ')}
                      </div>

                      {transfer.notes && (
                        <p className="text-xs text-slate-400 italic">
                          Clerk note: "{transfer.notes}"
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => onOpenRestockReview(transfer)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Audit 30-Day Sales & Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                All branch restock requisitions have been reviewed. No pending approvals.
              </div>
            )}
          </div>

          {/* Transfer History / In-Transit Pipeline */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Approved, Dispatched & Completed Stock Movement Pipeline
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Transfer #</th>
                    <th className="py-3 px-4">Destination Branch</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Waybill / Driver</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {store.stockTransfers
                    .filter((t) => t.status !== 'pending_approval')
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-950/40">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {t.transfer_number}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">{t.to_name}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {t.items
                            .map((i) => `${i.quantity_approved || i.quantity_requested}x ${i.product_name}`)
                            .join(', ')}
                        </td>
                        <td className="py-3 px-4">
                          {t.waybill_number ? (
                            <div>
                              <span className="font-mono text-slate-200">{t.waybill_number}</span>
                              <span className="block text-[10px] text-slate-400">
                                {t.driver_name} ({t.driver_phone})
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Awaiting dispatch</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              t.status === 'received'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : t.status === 'dispatched'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : t.status === 'approved'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {t.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenRestockReview(t)}
                            className="text-xs text-slate-400 hover:text-white underline"
                          >
                            View Audit
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

      {/* TAB CONTENT 2: Multi-Branch Inventory Matrix */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-base font-bold text-white">
                Multi-Branch Real-Time Inventory Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Stock distribution rules: Suppliers deliver only to Central Warehouse. Stock moves to branches via transfers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">SKU / Category</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-center text-blue-400">Central Warehouse</th>
                  <th className="py-3 px-4 text-center">Centric Medie</th>
                  <th className="py-3 px-4 text-center">Centric Lapaz</th>
                  <th className="py-3 px-4 text-center">Centric Kumasi</th>
                  <th className="py-3 px-4 text-center font-bold text-white">Total Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {store.products.map((p) => {
                  const whQty = store.getProductStock(warehouse.id, p.id)
                  const medieQty = store.getProductStock('22222222-2222-2222-2222-222222222222', p.id)
                  const lapazQty = store.getProductStock('33333333-3333-3333-3333-333333333333', p.id)
                  const kumasiQty = store.getProductStock('44444444-4444-4444-4444-444444444444', p.id)
                  const total = whQty + medieQty + lapazQty + kumasiQty

                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4 font-bold text-white">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {p.sku} <span className="text-slate-600">({p.category})</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        ₵{p.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-blue-400 bg-blue-950/10">
                        {whQty}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            medieQty <= p.low_stock_threshold
                              ? 'text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20'
                              : 'text-slate-200'
                          }
                        >
                          {medieQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            lapazQty <= p.low_stock_threshold
                              ? 'text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20'
                              : 'text-slate-200'
                          }
                        >
                          {lapazQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={
                            kumasiQty <= p.low_stock_threshold
                              ? 'text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20'
                              : 'text-slate-200'
                          }
                        >
                          {kumasiQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-extrabold text-white">
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

      {/* TAB CONTENT 3: Customer Credit Ledgers & Limits */}
      {activeTab === 'credit' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  Commercial Customer Credit Ledgers & Ceilings
                </h2>
                <p className="text-xs text-slate-400">
                  Provision limits, record debt settlement payments, and monitor credit risk across Ghana.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenNewCustomer}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Credit Customer
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Customer / Company</th>
                    <th className="py-3 px-4">Contact & TIN</th>
                    <th className="py-3 px-4 text-right">Credit Ceiling</th>
                    <th className="py-3 px-4 text-right">Current Outstanding Debt</th>
                    <th className="py-3 px-4 text-right text-emerald-400">Available Credit</th>
                    <th className="py-3 px-4">Utilization</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {customerBalanceList.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{cust.full_name}</div>
                        <div className="text-[11px] text-slate-400">{cust.company_name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>{cust.phone}</div>
                        <div className="text-slate-500">{cust.tin_number || 'No TIN'}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                        ₵{cust.limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-400">
                        ₵{cust.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        ₵{cust.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cust.percentUsed > 80
                                  ? 'bg-rose-500'
                                  : cust.percentUsed > 50
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                              }`}
                              style={{ width: `${cust.percentUsed}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {cust.percentUsed.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenPaymentRecord(cust)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                        >
                          Record Payment
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

      {/* TAB CONTENT 4: Consolidated Sales Ledger */}
      {activeTab === 'sales' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Consolidated Branch Sales Audit Log</h2>
              <p className="text-xs text-slate-400">
                All customer invoices across Medie, Lapaz, and Kumasi retail points.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Branch Filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
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
                  placeholder="Search invoice or customer..."
                  value={salesSearch}
                  onChange={(e) => setSalesSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Branch Location</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Amount (GHS)</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredSales.map((sale) => (
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
                    <td className="py-3 px-4 font-semibold text-white">{sale.location_name}</td>
                    <td className="py-3 px-4">{sale.customer_name}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {sale.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sale.payment_mode === 'credit'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {sale.payment_mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDocumentPrint(sale)}
                        title="Print Invoice / Official Receipt"
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
