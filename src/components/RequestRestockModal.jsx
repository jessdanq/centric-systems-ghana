import React, { useState } from 'react'
import { X, PackagePlus, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { store } from '../services/store'

export function RequestRestockModal({ isOpen, onClose, currentLocation, onSubmitted }) {
  if (!isOpen || !currentLocation) return null

  const warehouse = store.getWarehouseLocation()
  const branchStockList = store.getLocationStockList(currentLocation.id)

  const [selectedProductId, setSelectedProductId] = useState(branchStockList[0]?.id || '')
  const [quantity, setQuantity] = useState(5)
  const [notes, setNotes] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const selectedProduct = branchStockList.find((p) => p.id === selectedProductId)
  const warehouseStock = store.getProductStock(warehouse.id, selectedProductId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedProductId) {
      setErrorMsg('Please select a product')
      return
    }
    if (quantity <= 0) {
      setErrorMsg('Quantity requested must be greater than zero')
      return
    }

    try {
      store.requestRestock({
        fromLocationId: warehouse.id,
        toLocationId: currentLocation.id,
        requestedByName: currentLocation.manager_name || 'Branch Clerk',
        notes: notes || `Restock request for ${quantity}x ${selectedProduct?.name}`,
        items: [
          {
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
            sku: selectedProduct.sku,
            quantity_requested: quantity
          }
        ]
      })

      if (onSubmitted) onSubmitted()
      onClose()
      alert(`Restock request for ${quantity}x ${selectedProduct?.name} sent to Kwame Yeboah for approval!`)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ask for More Stock from Warehouse</h3>
              <p className="text-xs text-slate-500">{currentLocation.name}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              {branchStockList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Shelf: {p.quantity} | Min: {p.low_stock_threshold})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Current Branch Shelf Stock:</span>
                <p className={`font-mono font-bold mt-0.5 ${selectedProduct.isLowStock ? 'text-rose-700' : 'text-slate-900'}`}>
                  {selectedProduct.quantity} {selectedProduct.unit_of_measure}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Central Warehouse Stock:</span>
                <p className="font-mono font-bold text-emerald-700 mt-0.5">
                  {warehouseStock} {selectedProduct.unit_of_measure} available
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Quantity Needed:
            </label>
            <input
              type="number"
              min="1"
              max={warehouseStock > 0 ? warehouseStock : 100}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Reason for Request:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Current shelf stock is low. 3 inverters were sold this week to local contractors."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Note: Kwame Yeboah will review this reason along with your branch's past 30 days of sales before approving.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              Send Request to Owner
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
