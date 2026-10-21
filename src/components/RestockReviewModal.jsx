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
      alert('Stock request approved and sent to Central Warehouse for loading!')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = () => {
    if (!ownerNotes.trim()) {
      setErrorMsg('Please write a brief reason explaining why this restock request is declined.')
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
      alert('Stock request has been declined.')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                  Owner Audit & Verification
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {transfer.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                Review Stock Request: {transfer.transfer_number}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Requisition Origin Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
            <div>
              <span className="text-xs text-slate-500">Requesting Shop</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {transfer.to_name}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Requested By</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <User className="w-4 h-4 text-slate-400" />
                {transfer.requested_by_name}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Date Requested</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(transfer.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Supply Hub</span>
              <p className="font-semibold text-emerald-700 mt-0.5">
                Central Warehouse (Spintex)
              </p>
            </div>
          </div>

          {/* Clerk's Justification Note */}
          {transfer.notes && (
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-800">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] block mb-1">
                Why the branch clerk is asking for stock:
              </span>
              "{transfer.notes}"
            </div>
          )}

          {/* Item Selector & Stock Comparison */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
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
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-slate-900">{item.product_name}</div>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.sku}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs border-t border-slate-100 pt-2">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-medium">Branch Stock</span>
                        <span className={`font-bold font-mono ${currentQty <= 5 ? 'text-rose-700' : 'text-slate-900'}`}>
                          {currentQty} units
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-medium">Warehouse Stock</span>
                        <span className="font-bold font-mono text-emerald-700">
                          {whQty} units
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block font-medium">Requested</span>
                        <span className="font-bold font-mono text-amber-700">
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
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Past 30-Day Sales at {transfer.to_name}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Verified against sales receipts database
              </span>
            </div>

            {/* Velocity Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">30-Day Units Sold</span>
                <span className="text-lg font-bold font-mono text-slate-900">{total30DayUnitsSold} units</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">30-Day Sales Total</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  ₵{total30DayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">Average Sales Speed</span>
                <span className="text-lg font-bold font-mono text-amber-700">
                  {salesVelocity} units / day
                </span>
              </div>
            </div>

            {/* Sales Records Cross-Referenced with Customer Names */}
            {recentSales.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Receipt #</th>
                      <th className="py-2.5 px-3">Customer Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3 text-center">Qty Sold</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-3 text-center">Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {recentSales.map((sale, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(sale.sale_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">
                          {sale.invoice_number}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {sale.customer_name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {sale.customer_phone || 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {sale.quantity_sold}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-900 font-medium">
                          ₵{Number(sale.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sale.payment_mode === 'credit'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
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
              <div className="p-6 text-center rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
                <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                No sales records found for this product at {transfer.to_name} in the last 30 days.
                <p className="mt-1 text-slate-400">
                  Please confirm customer demand before approving new stock dispatch.
                </p>
              </div>
            )}
          </div>

          {/* Owner Decision & Approved Quantities Form */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Quantity to Approve
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {transfer.items?.map((item) => (
                <div
                  key={item.product_id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-slate-900">{item.product_name}</p>
                    <span className="text-[11px] text-slate-500">
                      Requested: <strong className="text-amber-800 font-semibold">{item.quantity_requested}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">Approve:</span>
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
                      className="w-20 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-sm text-center focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Owner Directives & Delivery Notes:
              </label>
              <textarea
                rows={2}
                value={ownerNotes}
                onChange={(e) => setOwnerNotes(e.target.value)}
                placeholder="e.g. Approved after checking inverter sales at Medie shop. Warehouse should send via morning delivery truck."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Reviewing as <strong className="text-slate-900">Kwame Yeboah</strong> (Business Owner)
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleReject}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Decline Request
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleApprove}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all disabled:opacity-50"
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
