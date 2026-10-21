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
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Record Credit Settlement</h3>
              <p className="text-xs text-slate-400">{customer.full_name}</p>
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

          {/* Customer Debt Overview */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Approved Credit Limit:</span>
              <span className="font-mono font-bold text-white">
                ₵{limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Outstanding Debt:</span>
              <span className="font-mono font-bold text-rose-400">
                ₵{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Remaining Available Credit:</span>
              <span className="font-mono font-bold text-emerald-400">
                ₵{available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Payment Amount (GHS ₵) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">₵</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-lg font-bold text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Ref / Trans ID
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Transaction Notes
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
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Credit Customer Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
