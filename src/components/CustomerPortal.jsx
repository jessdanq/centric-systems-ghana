import React from 'react'
import {
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Printer,
  Calendar,
  Building2,
  Phone,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react'
import { store } from '../services/store'

export function CustomerPortal({ currentUser, onOpenDocumentPrint }) {
  // Find customer profile
  const customerId =
    currentUser.customer_id ||
    store.customers[0]?.id

  const customer = store.customers.find((c) => c.id === customerId) || store.customers[0]
  const { balance, available, limit, percentUsed } = store.getCustomerBalance(customer.id)
  const ledgerEntries = store.getCustomerLedger(customer.id)
  const customerSales = store.sales.filter((s) => s.customer_id === customer.id)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Customer Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Buy Now, Pay Later Account
              </span>
              <span className="text-xs text-slate-500 font-mono">TIN: {customer.tin_number || 'N/A'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {customer.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800 font-semibold mt-0.5">
              {customer.company_name || 'Commercial Contractor Account'}
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-1">
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {customer.phone}
            </p>
            <p className="text-slate-500">{customer.address || 'Accra, Ghana'}</p>
          </div>
        </div>

        {/* Pay Later Limit Usage Bar */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Pay Later Limit Used:</span>
            <span className="font-mono font-bold text-slate-900">
              {percentUsed.toFixed(1)}% of allowed supplies taken
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentUsed > 80
                  ? 'bg-rose-500'
                  : percentUsed > 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pay Later Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Approved Pay Later Limit */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Pay Later Limit</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              ₵{limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-bold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Maximum goods you can take upfront before settling.</p>
        </div>

        {/* Current Unpaid Bill */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Current Unpaid Bill</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700">
              ₵{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-rose-800 font-bold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Orders taken waiting for payment settlement.</p>
        </div>

        {/* Available to Order Now */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider">Available to Order Now</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
              ₵{available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-800 font-bold">GHS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Remaining room to take goods across all Centric shops.</p>
        </div>
      </div>

      {/* Account Statement & Order Settlement History */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Supplies & Payment History</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Goods supplied to your sites vs payments received by Centric Systems.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Order / Payment Ref</th>
                <th className="py-3 px-4">Supplied Items / Notes</th>
                <th className="py-3 px-4">Payment Method / Staff</th>
                <th className="py-3 px-4 text-right text-rose-700">Added to Bill (Supplies)</th>
                <th className="py-3 px-4 text-right text-emerald-700">Payments Settled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(entry.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {entry.reference_number || 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{entry.notes}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {entry.payment_method} ({entry.recorded_by_name || 'Staff'})
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                    {entry.entry_type === 'debit'
                      ? `₵${Number(entry.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {entry.entry_type === 'credit'
                      ? `₵${Number(entry.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Invoices & PDF Downloads */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Order Receipts & Invoices</h2>

        {customerSales.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customerSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-emerald-300 transition-all"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    {sale.invoice_number}
                  </span>
                  <p className="text-xs text-slate-900 font-semibold mt-0.5">
                    {sale.items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Shop: {sale.location_name} •{' '}
                    {new Date(sale.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-slate-900">
                    ₵{sale.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDocumentPrint(sale)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-2xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs italic">
            No completed invoices on file yet.
          </div>
        )}
      </div>
    </div>
  )
}
