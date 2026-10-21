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
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Requisition Stock from Warehouse</h3>
              <p className="text-xs text-slate-400">{currentLocation.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {branchStockList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Shelf: {p.quantity} | Min: {p.low_stock_threshold})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Current Shelf Stock:</span>
                <p className={`font-mono font-bold mt-0.5 ${selectedProduct.isLowStock ? 'text-rose-400' : 'text-slate-200'}`}>
                  {selectedProduct.quantity} {selectedProduct.unit_of_measure}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Central Warehouse Stock:</span>
                <p className="font-mono font-bold text-emerald-400 mt-0.5">
                  {warehouseStock} {selectedProduct.unit_of_measure} available
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Quantity Needed:
            </label>
            <input
              type="number"
              min="1"
              max={warehouseStock > 0 ? warehouseStock : 100}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Justification / Restock Reason:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Current shelf count is critical. 3 solar inverters sold this week to local estate developers."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Note: Kwame Yeboah will review this reason along with your branch's past 30 days sales audit.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Submit to Owner
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
