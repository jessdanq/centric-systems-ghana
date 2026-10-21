import React, { useState } from 'react'
import { Printer, Download, X, CheckCircle, ShieldCheck, Building2, Phone, Mail, FileText, Calendar } from 'lucide-react'

export function DocumentPrintModal({ isOpen, onClose, documentData, initialType = 'invoice' }) {
  const [docType, setDocType] = useState(initialType) // 'invoice', 'receipt', 'quotation'

  if (!isOpen || !documentData) return null

  const handlePrint = () => {
    window.print()
  }

  const {
    invoice_number = 'INV-2026-0000',
    created_at = new Date().toISOString(),
    location_name = 'Centric Systems Ghana',
    customer_name = 'Walk-in Customer',
    customer_phone = 'N/A',
    cashier_name = 'Staff',
    items = [],
    subtotal = 0,
    discount = 0,
    tax_amount = 0,
    total_amount = 0,
    amount_paid = 0,
    payment_mode = 'cash',
    notes = ''
  } = documentData

  const docTitle = docType === 'invoice'
    ? 'COMMERCIAL SALES INVOICE'
    : docType === 'receipt'
      ? 'OFFICIAL PAYMENT RECEIPT'
      : 'PROFORMA QUOTATION'

  const formattedDate = new Date(created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto print-modal-overlay">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8 no-print:max-h-[90vh] flex flex-col">
        {/* Header Controls (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Document Type:</span>
            <div className="inline-flex rounded-xl bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setDocType('invoice')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  docType === 'invoice'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Official Invoice
              </button>
              <button
                type="button"
                onClick={() => setDocType('receipt')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  docType === 'receipt'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Payment Receipt
              </button>
              <button
                type="button"
                onClick={() => setDocType('quotation')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  docType === 'quotation'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Proforma Quote
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (A4 Layout) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100">
          <div
            id="printable-document"
            className="w-full max-w-[210mm] mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-md border border-slate-200"
          >
            {/* Header / Brand */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-emerald-600 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    C
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase">
                      Centric Systems Ghana Limited
                    </h1>
                    <p className="text-xs font-bold text-emerald-700 tracking-wide">
                      Industrial Electrical, Solar Energy & Automation Solutions
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <strong>HQ / Warehouse:</strong> Plot 48, Spintex Heavy Industrial Area, Accra, Ghana
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    +233 24 100 0001 / +233 24 400 1100
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    sales@centricsystems.gh | info@centricsystems.gh
                  </p>
                  <p className="font-mono text-slate-500">
                    <strong>GRA TIN:</strong> C0049281726 | <strong>Business Reg:</strong> CS-GH-2023-88192
                  </p>
                </div>
              </div>

              {/* Document Meta Pill */}
              <div className="sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[220px]">
                <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-md">
                  {docTitle}
                </span>
                <div className="mt-2 text-sm font-bold text-slate-900 font-mono">
                  {docType === 'quotation' ? invoice_number.replace('INV', 'QTE') : invoice_number}
                </div>
                <div className="mt-1 text-xs text-slate-500 flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formattedDate}
                </div>
                <div className="mt-1 text-xs text-slate-700">
                  <strong>Origin Shop:</strong> {location_name}
                </div>
              </div>
            </div>

            {/* Bill To & Transaction Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Billed To Customer</span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{customer_name}</h3>
                {customer_phone && <p className="text-slate-600 mt-0.5">Phone: {customer_phone}</p>}
                <p className="text-slate-500 mt-0.5">Terms: {payment_mode === 'credit' ? '30-Day Credit Account' : 'Direct Settlement'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Transaction Details</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-slate-500">Payment Method:</span>
                    <p className="font-semibold text-slate-900 uppercase">
                      {payment_mode === 'credit' ? 'Credit Account' : payment_mode === 'momo' ? 'MTN MoMo' : 'Cash'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Cashier:</span>
                    <p className="font-semibold text-slate-900">{cashier_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Currency:</span>
                    <p className="font-semibold text-slate-900">Ghana Cedis (GHS ₵)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <p className="font-semibold text-emerald-700">Completed & Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Item & Specification</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price (GHS)</th>
                    <th className="py-3 px-4 text-right">Total (GHS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.product_name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.sku}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {Number(item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-slate-950">
                        {Number(item.subtotal || item.quantity * item.unit_price).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mt-6">
              <div className="w-full sm:w-1/2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Payment Accounts</span>
                <p>
                  <strong>GCB Bank Ghana Ltd:</strong> Account #1141009823101 (Centric Systems Ghana Ltd)
                </p>
                <p>
                  <strong>MTN MoMo Merchant Till:</strong> 024 100 0001 (Centric Systems)
                </p>
                {notes && <p className="italic text-slate-500 pt-1 border-t border-slate-200">Note: {notes}</p>}
              </div>

              <div className="w-full sm:w-5/12 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">
                    ₵{Number(subtotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Discount:</span>
                    <span className="font-mono font-semibold">
                      -₵{Number(discount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {tax_amount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Levies (GRA):</span>
                    <span className="font-mono font-semibold">
                      ₵{Number(tax_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t-2 border-slate-300 flex justify-between items-center text-sm font-extrabold text-slate-950">
                  <span>Grand Total:</span>
                  <span className="text-base text-emerald-800 font-mono">
                    GHS ₵{Number(total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {docType === 'receipt' && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-700 font-semibold">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-emerald-700">
                      ₵{Number(amount_paid || total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Stamp & Signatory Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600/60 flex items-center justify-center text-emerald-700 p-2 text-center text-[8px] font-bold uppercase tracking-tighter">
                  CENTRIC OFFICIAL VALIDATED
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Centric Systems Ghana Limited</p>
                  <p className="text-[11px]">System Generated & Authenticated Record</p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="w-48 border-b border-slate-400 pb-1 mb-1 font-mono text-[10px] text-slate-400">
                  Authorized Signatory
                </div>
                <p className="text-[11px] font-semibold text-slate-700">Kwame Yeboah (Managing Director)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
