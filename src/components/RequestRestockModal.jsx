import React, { useState } from 'react'
import { X, PackagePlus, Plus, Trash2, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { store } from '../services/store'
import { showNotification } from '../context/ToastContext'

export function RequestRestockModal({ isOpen, onClose, currentLocation, onSubmitted }) {
  if (!isOpen || !currentLocation) return null

  const warehouse = store.getWarehouseLocation()
  const branchStockList = store.getLocationStockList(currentLocation.id)

  const [selectedProductId, setSelectedProductId] = useState(branchStockList[0]?.id || '')
  const [itemQty, setItemQty] = useState(5)
  const [notes, setNotes] = useState('Stock is low across these items. Several contractor inquiries this week.')
  const [errorMsg, setErrorMsg] = useState('')

  // List of items in this single restock requisition
  const [requestItems, setRequestItems] = useState(() => {
    // default to first low-stock item if available
    const firstLow = branchStockList.find((p) => p.isLowStock) || branchStockList[0]
    return firstLow
      ? [
          {
            product_id: firstLow.id,
            product_name: firstLow.name,
            sku: firstLow.sku,
            unit_of_measure: firstLow.unit_of_measure,
            quantity_requested: 5,
            current_shelf_stock: firstLow.quantity,
            warehouse_stock: store.getProductStock(warehouse.id, firstLow.id)
          }
        ]
      : []
  })

  const selectedProduct = branchStockList.find((p) => p.id === selectedProductId)
  const warehouseStock = store.getProductStock(warehouse.id, selectedProductId)

  const handleAddItemToRequest = () => {
    setErrorMsg('')
    if (!selectedProduct) {
      setErrorMsg('Please select an item to add.')
      return
    }
    const qty = Number(itemQty)
    if (qty <= 0) {
      setErrorMsg('Quantity must be at least 1.')
      return
    }

    const existingIdx = requestItems.findIndex((i) => i.product_id === selectedProduct.id)
    if (existingIdx !== -1) {
      const updated = [...requestItems]
      updated[existingIdx].quantity_requested += qty
      setRequestItems(updated)
    } else {
      setRequestItems([
        ...requestItems,
        {
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          sku: selectedProduct.sku,
          unit_of_measure: selectedProduct.unit_of_measure,
          quantity_requested: qty,
          current_shelf_stock: selectedProduct.quantity,
          warehouse_stock: warehouseStock
        }
      ])
    }
  }

  const handleRemoveItem = (index) => {
    setRequestItems(requestItems.filter((_, idx) => idx !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (requestItems.length === 0) {
      setErrorMsg('Please add at least one product to your stock request.')
      return
    }

    try {
      store.requestRestock({
        fromLocationId: warehouse.id,
        toLocationId: currentLocation.id,
        requestedByName: currentLocation.manager_name || 'Branch Clerk',
        notes: notes || `Restock request for ${requestItems.length} product lines`,
        items: requestItems.map((i) => ({
          product_id: i.product_id,
          product_name: i.product_name,
          sku: i.sku,
          quantity_requested: i.quantity_requested
        }))
      })

      if (onSubmitted) onSubmitted()
      onClose()
      showNotification(`Restock request for ${requestItems.length} product${requestItems.length === 1 ? '' : 's'} sent to Kwame Yeboah for approval!`)
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
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Request Stock from Central Warehouse</h3>
              <p className="text-xs text-slate-500">{currentLocation.name} (Add multiple items to one request)</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Staging Box to add items */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-700" />
              Add Items to This Restock Request
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Product:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  {branchStockList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Shelf: {p.quantity} | WH: {store.getProductStock(warehouse.id, p.id)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity Needed:</label>
                <input
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>
                  Branch shelf stock:{' '}
                  <strong className={selectedProduct.isLowStock ? 'text-rose-700' : 'text-slate-900'}>
                    {selectedProduct.quantity} {selectedProduct.unit_of_measure}
                  </strong>
                </span>
                <span>
                  Central Warehouse available:{' '}
                  <strong className="text-emerald-700">
                    {warehouseStock} {selectedProduct.unit_of_measure}
                  </strong>
                </span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddItemToRequest}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item to Request
              </button>
            </div>
          </div>

          {/* Table of Items in this Request */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Products in this Request ({requestItems.length} Item{requestItems.length === 1 ? '' : 's'}):
              </span>
            </div>

            {requestItems.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-center">Shelf Stock</th>
                        <th className="py-2.5 px-3 text-center">WH Stock</th>
                        <th className="py-2.5 px-3 text-center text-amber-800">Requested Qty</th>
                        <th className="py-2.5 px-3 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {requestItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{item.product_name}</td>
                          <td className="py-2.5 px-3 text-center font-mono">{item.current_shelf_stock}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">{item.warehouse_stock}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-extrabold text-amber-700 text-sm">
                            {item.quantity_requested}
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
                  {requestItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900 block">{item.product_name}</span>
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
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Shelf Stock</span>
                          <span className="font-mono font-bold text-slate-700">{item.current_shelf_stock}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Warehouse</span>
                          <span className="font-mono font-bold text-emerald-700">{item.warehouse_stock}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-amber-800 block">Requested</span>
                          <span className="font-mono font-extrabold text-amber-700 text-sm">{item.quantity_requested}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-slate-200">
                No items added yet. Choose products above to add them to your request.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reason / Notes for Kwame Yeboah:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Inverters and cables are low. Two estate contractors in Pokuase scheduled to purchase this week."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Note: Kwame Yeboah will review this together with your shop's previous 30-day sales for each item before approving.
            </p>
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
              disabled={requestItems.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Send Request to Owner ({requestItems.length} Products)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
