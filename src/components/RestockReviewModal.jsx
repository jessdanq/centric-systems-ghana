import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  User,
  History,
  TrendingUp,
  Package,
  ArrowRight,
  ShieldCheck,
  DollarSign
} from 'lucide-react'
import { store } from '../services/store'

export function RestockReviewModal({ isOpen, onClose, transfer, onApproved, onRejected }) {
  if (!isOpen || !transfer) return null

  const [selectedProductId, setSelectedProductId] = useState(
    transfer.items?.[0]?.product_id || null
  )
  const [approvedQuantities, setApprovedQuantities] = useState(() => {
    const map = {}
    transfer.items?.forEach((item) => {
      map[item.product_id] = item.quantity_requested
    })
    return map
  })
  const [ownerNotes, setOwnerNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Query warehouse stock & branch stock for the selected item
  const warehouse = store.getWarehouseLocation()
  const selectedItem = transfer.items?.find((i) => i.product_id === selectedProductId) || transfer.items?.[0]
  const currentBranchStock = store.getProductStock(transfer.to_location_id, selectedItem?.product_id)
  const warehouseStock = store.getProductStock(warehouse.id, selectedItem?.product_id)

  // Critical requirement: Pull last 30 days of sales at this branch cross-referenced with customer names
  const recentSales = store.getBranchRecentProductSales(
    transfer.to_location_id,
    selectedItem?.product_id,
    30
  )

  const total30DayUnitsSold = recentSales.reduce((sum, s) => sum + s.quantity_sold, 0)
  const total30DayRevenue = recentSales.reduce((sum, s) => sum + s.subtotal, 0)
  const salesVelocity = (total30DayUnitsSold / 30).toFixed(2)

  const handleApprove = () => {
    try {
      setIsSubmitting(true)
      setErrorMsg('')

      const approvedItemsPayload = transfer.items.map((item) => ({
        product_id: item.product_id,
        quantity_approved: Number(approvedQuantities[item.product_id] ?? item.quantity_requested)
      }))

      store.approveRestockTransfer(
        transfer.id,
        approvedItemsPayload,
        ownerNotes || 'Approved by Kwame Yeboah after reviewing 30-day branch sales velocity.',
        'Kwame Yeboah (Owner)'
      )

      if (onApproved) onApproved()
      onClose()
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = () => {
    if (!ownerNotes.trim()) {
      setErrorMsg('Please specify rejection notes explaining why this restock is declined.')
      return
    }

    try {
      setIsSubmitting(true)
      store.rejectRestockTransfer(
        transfer.id,
        ownerNotes,
        'Kwame Yeboah (Owner)'
      )
      if (onRejected) onRejected()
      onClose()
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Owner Audit & Verification
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {transfer.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Restock Authorization: {transfer.transfer_number}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Requisition Origin Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm">
            <div>
              <span className="text-xs text-slate-400">Requesting Branch</span>
              <p className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                {transfer.to_name}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Requested By</span>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                <User className="w-4 h-4 text-slate-400" />
                {transfer.requested_by_name}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Date Requested</span>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(transfer.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Supply Hub</span>
              <p className="font-semibold text-emerald-300 mt-0.5">
                Central Warehouse (Accra)
              </p>
            </div>
          </div>

          {/* Clerk's Justification Note */}
          {transfer.notes && (
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                Branch Clerk's Requisition Note:
              </span>
              "{transfer.notes}"
            </div>
          )}

          {/* Item Selector & Stock Comparison */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Item to Review 30-Day Branch Sales:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {transfer.items?.map((item) => {
                const isSelected = item.product_id === selectedProductId
                const currentQty = store.getProductStock(transfer.to_location_id, item.product_id)
                const whQty = store.getProductStock(warehouse.id, item.product_id)

                return (
                  <button
                    key={item.product_id}
                    type="button"
                    onClick={() => setSelectedProductId(item.product_id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-white">{item.product_name}</div>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.sku}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs border-t border-slate-800/60 pt-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Branch Stock</span>
                        <span className={`font-bold font-mono ${currentQty <= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {currentQty} units
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">WH Stock</span>
                        <span className="font-bold font-mono text-emerald-400">
                          {whQty} units
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Requested</span>
                        <span className="font-bold font-mono text-amber-400">
                          {item.quantity_requested} units
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CRITICAL SECTION: 30-Day Sales Verification Table (Cross-referenced with customer names) */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  30-Day Sales Audit for {transfer.to_name}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Verified against Centric Point-of-Sale database
              </span>
            </div>

            {/* Velocity Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">30-Day Units Sold</span>
                <span className="text-lg font-bold font-mono text-white">{total30DayUnitsSold} units</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">30-Day Branch Turnover</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  ₵{total30DayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Sales Velocity</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {salesVelocity} units / day
                </span>
              </div>
            </div>

            {/* Sales Records Cross-Referenced with Customer Names */}
            {recentSales.length > 0 ? (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Customer Name</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3 text-center">Qty Sold</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-3 text-center">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {recentSales.map((sale, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(sale.sale_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">
                          {sale.invoice_number}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {sale.customer_name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {sale.customer_phone || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-300">
                          {sale.quantity_sold}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-white">
                          ₵{Number(sale.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-center">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                No sales records found for this product at {transfer.to_name} in the last 30 days.
                <p className="mt-1 text-slate-500">
                  Please verify demand before authorizing new inventory dispatch.
                </p>
              </div>
            )}
          </div>

          {/* Owner Decision & Approved Quantities Form */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Authorization & Quantity Adjustments
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {transfer.items?.map((item) => (
                <div
                  key={item.product_id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-white">{item.product_name}</p>
                    <span className="text-[11px] text-slate-400">
                      Requested: <strong className="text-amber-400">{item.quantity_requested}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Approve:</span>
                    <input
                      type="number"
                      min="0"
                      max={store.getProductStock(warehouse.id, item.product_id)}
                      value={approvedQuantities[item.product_id] ?? item.quantity_requested}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0)
                        setApprovedQuantities((prev) => ({
                          ...prev,
                          [item.product_id]: val
                        }))
                      }}
                      className="w-20 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Owner Directives & Review Notes:
              </label>
              <textarea
                rows={2}
                value={ownerNotes}
                onChange={(e) => setOwnerNotes(e.target.value)}
                placeholder="e.g. Approved after verifying 3 inverter sales at Medie shop. Warehouse should dispatch via morning delivery truck."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-900 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Reviewed as <strong className="text-white">Kwame Yeboah</strong> (Business Owner)
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleReject}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Decline Requisition
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleApprove}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve & Send to Warehouse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
