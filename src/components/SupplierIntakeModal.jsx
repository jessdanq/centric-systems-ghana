import React, { useState } from 'react'
import { X, Truck, Plus, Trash2, ArrowRight } from 'lucide-react'
import { store } from '../services/store'

export function SupplierIntakeModal({ isOpen, onClose, onIntakeCompleted }) {
  if (!isOpen) return null

  const warehouse = store.getWarehouseLocation()
  const products = store.products

  const [supplierName, setSupplierName] = useState('Growatt New Energy Overseas')
  const [supplierInvoiceRef, setSupplierInvoiceRef] = useState(`GW-IMP-${Math.floor(1000 + Math.random() * 9000)}`)
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '')
  const [quantity, setQuantity] = useState(10)
  const [unitCost, setUnitCost] = useState(products[0]?.cost_price || 0)
  const [notes, setNotes] = useState('Central Warehouse bulk supplier intake container delivery.')
  const [errorMsg, setErrorMsg] = useState('')

  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId)
    const p = products.find((x) => x.id === prodId)
    if (p) {
      setUnitCost(p.cost_price)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const p = products.find((x) => x.id === selectedProductId)
    if (!p) {
      setErrorMsg('Please select a product')
      return
    }

    try {
      store.receiveSupplierIntake({
        supplierName,
        supplierInvoiceRef,
        receivedByName: 'Kofi Mensah (Warehouse Manager)',
        items: [
          {
            product_id: p.id,
            product_name: p.name,
            sku: p.sku,
            quantity: Number(quantity),
            unit_cost: Number(unitCost)
          }
        ],
        notes
      })

      if (onIntakeCompleted) onIntakeCompleted()
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
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Inbound Supplier Intake</h3>
              <p className="text-xs text-emerald-400 font-mono">Central Warehouse (Exclusive Delivery Hub)</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Supplier Entity *
              </label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Supplier Invoice / Waybill
              </label>
              <input
                type="text"
                value={supplierInvoiceRef}
                onChange={(e) => setSupplierInvoiceRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Select Product Master:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Quantity Received:
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Unit Landed Cost (GHS ₵):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Total Goods Value:</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              GHS ₵{(Number(quantity) * Number(unitCost)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Intake Notes:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
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
              Intake Into Warehouse Stock
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
