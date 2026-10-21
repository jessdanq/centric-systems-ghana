import React, { useState } from 'react'
import {
  Boxes,
  Truck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  PackageCheck,
  History,
  ShieldCheck
} from 'lucide-react'
import { store } from '../services/store'

export function WarehouseDashboard({ currentUser, onOpenSupplierIntake }) {
  const [activeTab, setActiveTab] = useState('dispatch') // 'dispatch', 'stock', 'intakes'
  const [selectedTransferForDispatch, setSelectedTransferForDispatch] = useState(null)
  const [waybillNumber, setWaybillNumber] = useState(`WB-GH-${Math.floor(10000 + Math.random() * 90000)}`)
  const [driverName, setDriverName] = useState('Emmanuel K. Addo (VIP Haulage)')
  const [driverPhone, setDriverPhone] = useState('+233 24 333 8811')
  const [dispatchNotes, setDispatchNotes] = useState('')
  const [dispatchError, setDispatchError] = useState('')

  const warehouse = store.getWarehouseLocation()
  const warehouseStockList = store.getLocationStockList(warehouse.id)

  // Approved transfers awaiting warehouse dispatch
  const approvedTransfers = store.stockTransfers.filter((t) => t.status === 'approved')
  const dispatchedTransfers = store.stockTransfers.filter(
    (t) => t.status === 'dispatched' || t.status === 'received'
  )

  const handleDispatch = (e) => {
    e.preventDefault()
    if (!selectedTransferForDispatch) return
    setDispatchError('')

    try {
      store.dispatchRestockTransfer(selectedTransferForDispatch.id, {
        dispatchedByName: currentUser.name,
        waybillNumber,
        driverName,
        driverPhone,
        notes: dispatchNotes
      })

      setSelectedTransferForDispatch(null)
      setDispatchNotes('')
    } catch (err) {
      setDispatchError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Warehouse Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Central Distribution Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">{warehouse.code}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            Central Warehouse Logistics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Exclusive entry point for overseas & local supplier goods. Distribution source for Medie, Lapaz, and Kumasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSupplierIntake}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Receive Supplier Inbound Delivery
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'dispatch'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Truck className="w-4 h-4" />
          Restock Dispatch Queue
          {approvedTransfers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
              {approvedTransfers.length} Ready to Dispatch
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'stock'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Central Warehouse Bulk Inventory
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intakes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'intakes'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          Supplier Intake History ({store.supplierIntakes.length})
        </button>
      </div>

      {/* TAB 1: Restock Dispatch Queue */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          {/* Dispatch Form Modal if selected */}
          {selectedTransferForDispatch && (
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">
                    Dispatch Transfer {selectedTransferForDispatch.transfer_number} to{' '}
                    {selectedTransferForDispatch.to_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTransferForDispatch(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {dispatchError && (
                <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {dispatchError}
                </div>
              )}

              <form onSubmit={handleDispatch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Carrier Waybill / Tracking # *
                    </label>
                    <input
                      type="text"
                      required
                      value={waybillNumber}
                      onChange={(e) => setWaybillNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Driver Name & Haulage *
                    </label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Driver Phone Contact *
                    </label>
                    <input
                      type="tel"
                      required
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Dispatch Notes / Gate Pass
                  </label>
                  <input
                    type="text"
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="e.g. Dispatched via VIP morning truck. Gate pass verified by Kofi Mensah."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTransferForDispatch(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Dispatch to Branch
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Approved Queue */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">
              Approved Restock Orders (Awaiting Warehouse Logistics Dispatch)
            </h2>

            {approvedTransfers.length > 0 ? (
              <div className="space-y-3">
                {approvedTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {transfer.transfer_number}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-bold text-white">{transfer.to_name}</span>
                        <span className="text-slate-600">•</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Approved by Kwame Yeboah
                        </span>
                      </div>

                      <div className="text-xs text-white">
                        <strong>Approved Items for Dispatch:</strong>{' '}
                        {transfer.items
                          .map((i) => `${i.quantity_approved}x ${i.product_name}`)
                          .join(', ')}
                      </div>

                      {transfer.owner_review_notes && (
                        <p className="text-xs text-slate-400 italic">
                          Kwame Yeboah directives: "{transfer.owner_review_notes}"
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedTransferForDispatch(transfer)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        Assign Driver & Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
                No transfers currently awaiting dispatch.
              </div>
            )}
          </div>

          {/* In-Transit & Dispatched Log */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Dispatched In-Transit & Completed Transfers
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Transfer #</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Waybill #</th>
                    <th className="py-3 px-4">Driver & Contact</th>
                    <th className="py-3 px-4">Dispatched At</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {dispatchedTransfers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {t.transfer_number}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{t.to_name}</td>
                      <td className="py-3 px-4 font-mono text-slate-200">{t.waybill_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {t.driver_name} <span className="text-slate-500">({t.driver_phone})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {t.dispatched_at
                          ? new Date(t.dispatched_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Pending'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.status === 'received'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Central Warehouse Bulk Inventory */}
      {activeTab === 'stock' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Central Warehouse Inventory Hub</h2>
              <p className="text-xs text-slate-400">Spintex Heavy Industrial Area Bulk Storage</p>
            </div>
            <button
              type="button"
              onClick={onOpenSupplierIntake}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Supplier Intake
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Warehouse Stock</th>
                  <th className="py-3 px-4 text-right">Landed Cost (GHS)</th>
                  <th className="py-3 px-4 text-right">Retail Price (GHS)</th>
                  <th className="py-3 px-4 text-right">Total Asset Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {warehouseStockList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.sku}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-blue-400 text-sm">
                      {item.quantity} {item.unit_of_measure}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      ₵{item.cost_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₵{(item.quantity * item.unit_price).toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Supplier Intake History */}
      {activeTab === 'intakes' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Supplier Inbound Shipments Log</h2>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Invoice Ref</th>
                  <th className="py-3 px-4">Received Items</th>
                  <th className="py-3 px-4 text-right">Total Cost (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {store.supplierIntakes.map((intake) => (
                  <tr key={intake.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {intake.receipt_number}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(intake.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{intake.supplier_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{intake.supplier_invoice_ref}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {intake.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₵{intake.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
