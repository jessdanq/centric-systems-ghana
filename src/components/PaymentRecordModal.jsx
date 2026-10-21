import React, { useState } from 'react'
import { X, CreditCard, CheckCircle2, DollarSign, Wallet } from 'lucide-react'
import { store } from '../services/store'

export function PaymentRecordModal({ isOpen, onClose, customer, onPaymentRecorded }) {
  if (!isOpen || !customer) return null

  const { balance, available, limit } = store.getCustomerBalance(customer.id)

  const [amount, setAmount] = useState(balance > 0 ? balance : '')
  const [paymentMethod, setPaymentMethod] = useState('MTN MoMo')
  const [referenceNumber, setReferenceNumber] = useState(`MM-${Math.floor(100000 + Math.random() * 900000)}`)
  const [notes, setNotes] = useState('Customer debt settlement')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Payment amount must be greater than zero')
      return
    }

    try {
      store.recordCreditPayment({
        customerId: customer.id,
        amount: numAmount,
        paymentMethod,
        referenceNumber,
        notes,
        recordedByName: 'Kwame Yeboah'
      })

      if (onPaymentRecorded) onPaymentRecorded()
      onClose()
      alert(`Payment of ₵${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} recorded for ${customer.full_name}!`)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record a Customer Payment</h3>
              <p className="text-xs text-slate-500">{customer.full_name}</p>
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

          {/* Customer Debt Overview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Credit Limit:</span>
              <span className="font-mono font-bold text-slate-900">
                ₵{limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Money Currently Owed:</span>
              <span className="font-mono font-bold text-rose-700">
                ₵{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
              <span>Available to Spend:</span>
              <span className="font-mono font-bold text-emerald-700">
                ₵{available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Payment Amount (GHS ₵) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-bold">₵</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-emerald-300 font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="MTN MoMo">MTN MoMo</option>
                <option value="Telecel Cash">Telecel Cash</option>
                <option value="GCB Bank Wire">GCB Bank Transfer</option>
                <option value="Ecobank Wire">Ecobank Transfer</option>
                <option value="Cash Deposit">Direct Cash</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ref / Trans ID
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Transaction Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              Record Payment & Update Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
