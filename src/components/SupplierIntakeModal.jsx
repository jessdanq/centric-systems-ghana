import React, { useState } from 'react'
import { X, Truck, Plus, Trash2, ArrowRight, PackagePlus, CheckCircle2 } from 'lucide-react'
import { store } from '../services/store'

export function SupplierIntakeModal({ isOpen, onClose, onIntakeCompleted }) {
  if (!isOpen) return null

  const warehouse = store.getWarehouseLocation()
  const products = store.products

  const [supplierName, setSupplierName] = useState('Growatt New Energy Overseas')
  const [supplierInvoiceRef, setSupplierInvoiceRef] = useState(`GW-IMP-${Math.floor(1000 + Math.random() * 9000)}`)
  const [notes, setNotes] = useState('Central Warehouse bulk container delivery.')
  const [errorMsg, setErrorMsg] = useState('')

  // Current item being staged to add to truck
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '')
  const [itemQty, setItemQty] = useState(10)
  const [itemCost, setItemCost] = useState(products[0]?.cost_price || 0)

  // List of all products loaded in this delivery truck
  const [truckItems, setTruckItems] = useState([
    {
      product_id: products[0]?.id,
      product_name: products[0]?.name,
      sku: products[0]?.sku,
      quantity: 10,
      unit_cost: products[0]?.cost_price || 6800.00,
      subtotal: 10 * (products[0]?.cost_price || 6800.00)
    }
  ])

  const handleProductSelect = (prodId) => {
    setSelectedProductId(prodId)
    const p = products.find((x) => x.id === prodId)
    if (p) {
      setItemCost(p.cost_price)
    }
  }

  const handleAddItemToTruck = () => {
    setErrorMsg('')
    const p = products.find((x) => x.id === selectedProductId)
    if (!p) {
      setErrorMsg('Please select a product to add to the delivery truck.')
      return
    }
    const qty = Number(itemQty)
    const cost = Number(itemCost)
    if (qty <= 0) {
      setErrorMsg('Quantity must be at least 1.')
      return
    }

    const existingIndex = truckItems.findIndex((i) => i.product_id === p.id)
    if (existingIndex !== -1) {
      // update existing
      const updated = [...truckItems]
      updated[existingIndex].quantity += qty
      updated[existingIndex].unit_cost = cost
      updated[existingIndex].subtotal = updated[existingIndex].quantity * cost
      setTruckItems(updated)
    } else {
      setTruckItems([
        ...truckItems,
        {
          product_id: p.id,
          product_name: p.name,
          sku: p.sku,
          quantity: qty,
          unit_cost: cost,
          subtotal: qty * cost
        }
      ])
    }
  }

  const handleRemoveItem = (index) => {
    setTruckItems(truckItems.filter((_, idx) => idx !== index))
  }

  const totalTruckCost = truckItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (truckItems.length === 0) {
      setErrorMsg('Please add at least one product item to the delivery truck before saving.')
      return
    }

    try {
      store.receiveSupplierIntake({
        supplierName,
        supplierInvoiceRef,
        receivedByName: 'Kofi Mensah (Warehouse Logistics)',
        items: truckItems,
        notes
      })

      if (onIntakeCompleted) onIntakeCompleted()
      onClose()
      alert(`Success! Delivery truck with ${truckItems.length} product lines added to Central Warehouse stock.`)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delivery Truck Arrived (Multiple Products)</h3>
              <p className="text-xs text-emerald-800 font-semibold">Central Warehouse Intake Manifest</p>
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

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Supplier Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Supplier Company *
              </label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. Growatt New Energy"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Waybill / Delivery Invoice #
              </label>
              <input
                type="text"
                value={supplierInvoiceRef}
                onChange={(e) => setSupplierInvoiceRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Add Item to Truck Staging Box */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <PackagePlus className="w-4 h-4 text-emerald-700" />
              Add Products In This Truck Delivery
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Product:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Qty Received:</label>
                <input
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Landed Cost (GHS ₵):</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={itemCost}
                  onChange={(e) => setItemCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddItemToTruck}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item to Truck Manifest
              </button>
            </div>
          </div>

          {/* Truck Manifest Table */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Items in This Delivery Truck ({truckItems.length} Product{truckItems.length === 1 ? '' : 's'}):
              </span>
              <span className="text-xs font-bold text-emerald-800 font-mono">
                Total Value: GHS ₵{totalTruckCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {truckItems.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Landed Cost (GHS)</th>
                        <th className="py-2.5 px-3 text-right">Total (GHS)</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {truckItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{item.product_name}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.sku}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                            ₵{Number(item.unit_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                            ₵{Number(item.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="block sm:hidden space-y-2">
                  {truckItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900 block">{item.product_name}</span>
                          <span className="text-[11px] font-mono text-slate-500">{item.sku}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-slate-200 text-center">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Quantity</span>
                          <span className="font-mono font-bold text-slate-900">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Landed Cost</span>
                          <span className="font-mono text-slate-700">₵{Number(item.unit_cost).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-800 block">Total</span>
                          <span className="font-mono font-bold text-emerald-800 text-xs">₵{Number(item.subtotal).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-slate-200">
                No products added to this truck yet. Use the box above to add items.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Delivery Notes / Inspection Remarks:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Inspected at Central Warehouse gate by Kofi Mensah. All boxes intact."
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={truckItems.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Delivery Truck ({truckItems.length} Product{truckItems.length === 1 ? '' : 's'} Added)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
