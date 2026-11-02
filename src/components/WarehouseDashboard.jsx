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
import { showNotification } from '../context/ToastContext'

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
      showNotification('Goods successfully marked as dispatched! Driver is now on the way to the branch.')
    } catch (err) {
      setDispatchError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Warehouse Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Central Distribution Hub
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">{warehouse.code}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Central Warehouse Logistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Exclusive delivery point for overseas and local suppliers. Supplies goods to Medie, Lapaz, and Kumasi shops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSupplierIntake}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Delivery Truck Arrived (Add New Stock)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'dispatch'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          Ready to Send to Branches
          {approvedTransfers.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'dispatch' ? 'bg-white text-emerald-800' : 'bg-amber-500 text-white'
            }`}>
              {approvedTransfers.length} ready
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'stock'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Warehouse Bulk Stock
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intakes')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'intakes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          Past Deliveries Received ({store.supplierIntakes.length})
        </button>
      </div>

      {/* TAB 1: Ready to Send to Branches */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          {/* Dispatch Form Modal if selected */}
          {selectedTransferForDispatch && (
            <div className="p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    Send Stock Delivery to {selectedTransferForDispatch.to_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTransferForDispatch(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
              </div>

              {dispatchError && (
                <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  {dispatchError}
                </div>
              )}

              <form onSubmit={handleDispatch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Carrier Waybill / Tracking # *
                    </label>
                    <input
                      type="text"
                      required
                      value={waybillNumber}
                      onChange={(e) => setWaybillNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Driver Name & Truck # *
                    </label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Driver Phone Contact *
                    </label>
                    <input
                      type="tel"
                      required
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Dispatch Notes / Gate Pass
                  </label>
                  <input
                    type="text"
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="e.g. Sent via VIP morning truck. Gate pass signed by Kofi Mensah."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTransferForDispatch(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Goods Sent to Branch
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Approved Queue */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Orders Approved by Owner (Ready to Send Out)
            </h2>

            {approvedTransfers.length > 0 ? (
              <div className="space-y-3">
                {approvedTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          {transfer.to_name}
                        </span>
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Approved by Kwame Yeboah
                        </span>
                      </div>

                      <div className="text-xs text-slate-900 font-bold">
                        Approved Items to Send:{' '}
                        <span className="font-medium text-slate-700">
                          {transfer.items
                            .map((i) => `${i.quantity_approved}x ${i.product_name}`)
                            .join(', ')}
                        </span>
                      </div>

                      {transfer.owner_review_notes && (
                        <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                          <strong>Kwame Yeboah instructions:</strong> "{transfer.owner_review_notes}"
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedTransferForDispatch(transfer)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        Assign Driver & Send
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                No orders currently waiting for dispatch.
              </div>
            )}
          </div>

          {/* In-Transit & Dispatched Log */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Dispatched (On the Way) & Completed Deliveries
            </h3>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Waybill #</th>
                    <th className="py-3 px-4">Driver & Phone</th>
                    <th className="py-3 px-4">Dispatched At</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dispatchedTransfers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {t.to_name}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-900 font-medium">{t.waybill_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-800">
                        {t.driver_name} <span className="text-slate-500">({t.driver_phone})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
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
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.status === 'received'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {t.status === 'received' ? 'Delivered & Received' : 'On the Way'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden space-y-3">
              {dispatchedTransfers.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm">{t.to_name}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'received'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {t.status === 'received' ? 'Delivered' : 'On the Way'}
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination:</span>
                    <span className="font-bold text-slate-900">{t.to_name}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waybill & Driver:</span>
                    <span className="font-mono font-bold text-slate-900 block">{t.waybill_number || 'No Waybill #'}</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {t.driver_name} {t.driver_phone && `(${t.driver_phone})`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 flex justify-between items-center border-t border-slate-200">
                    <span>Dispatched:</span>
                    <span className="font-medium text-slate-700">
                      {t.dispatched_at
                        ? new Date(t.dispatched_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Central Warehouse Bulk Stock */}
      {activeTab === 'stock' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Central Warehouse Stock Hub</h2>
              <p className="text-xs text-slate-500 mt-0.5">Spintex Heavy Industrial Area Bulk Storage</p>
            </div>
            <button
              type="button"
              onClick={onOpenSupplierIntake}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Delivery Truck Arrived
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Warehouse Stock</th>
                  <th className="py-3 px-4 text-right">Cost Price (GHS)</th>
                  <th className="py-3 px-4 text-right">Retail Price (GHS)</th>
                  <th className="py-3 px-4 text-right">Total Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {warehouseStockList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-blue-700 text-sm">
                      {item.quantity} {item.unit_of_measure}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ₵{item.cost_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">
                      ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₵{(item.quantity * item.unit_price).toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-3">
            {warehouseStockList.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">{item.category}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-mono font-extrabold text-xs shrink-0 border border-blue-200">
                    {item.quantity} {item.unit_of_measure}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cost (Landed)</span>
                    <span className="font-mono text-slate-700 font-bold">
                      ₵{item.cost_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 font-semibold uppercase block">Selling Price</span>
                    <span className="font-mono text-emerald-800 font-bold">
                      ₵{item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Total Bulk Value:</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    ₵{(item.quantity * item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Supplier Intake History */}
      {activeTab === 'intakes' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Past Supplier Deliveries Received</h2>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Invoice / Waybill Ref</th>
                  <th className="py-3 px-4">Received Items</th>
                  <th className="py-3 px-4 text-right">Total Cost (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {store.supplierIntakes.map((intake) => (
                  <tr key={intake.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {intake.receipt_number}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(intake.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{intake.supplier_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{intake.supplier_invoice_ref}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {intake.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₵{intake.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-3">
            {store.supplierIntakes.map((intake) => (
              <div key={intake.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    {intake.receipt_number}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {new Date(intake.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{intake.supplier_name}</span>
                  <span className="text-[11px] font-mono text-slate-500">Invoice: {intake.supplier_invoice_ref}</span>
                </div>

                <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-400 block text-[10px] uppercase mb-0.5">Received Items:</span>
                  {intake.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Total Landed Cost:</span>
                  <span className="font-mono font-bold text-slate-950 text-sm">
                    ₵{intake.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
