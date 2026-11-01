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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print-modal-overlay">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] print:max-h-none flex flex-col">
        {/* Header Controls (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-50 border-b border-slate-200 gap-2 shrink-0 no-print">
          <div className="flex items-center justify-between sm:justify-start gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 shrink-0 hidden xs:inline">Type:</span>
            <div className="inline-flex rounded-xl bg-slate-200/70 p-1 shrink-0">
              <button
                type="button"
                onClick={() => setDocType('invoice')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  docType === 'invoice'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Invoice
              </button>
              <button
                type="button"
                onClick={() => setDocType('receipt')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  docType === 'receipt'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Receipt
              </button>
              <button
                type="button"
                onClick={() => setDocType('quotation')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  docType === 'quotation'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Quote
              </button>
            </div>

            {/* Mobile close button on right of toolbar */}
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (Strict 1-Page A4 Layout) */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-100 print:p-0 print:m-0 print:bg-white print:overflow-visible print-modal-sheet-container">
          <div
            id="printable-document"
            className="w-full max-w-[210mm] mx-auto bg-white text-slate-900 p-6 sm:p-8 print:p-4 rounded-xl shadow-md border border-slate-200 print:border-none print:shadow-none print:rounded-none"
          >
            {/* Header / Brand */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-3.5 print:pb-2.5 border-b-2 border-emerald-600 gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    C
                  </div>
                  <div>
                    <h1 className="text-lg font-extrabold tracking-tight text-slate-950 uppercase leading-tight">
                      Centric Systems Ghana Limited
                    </h1>
                    <p className="text-[11px] font-bold text-emerald-700 tracking-wide">
                      Industrial Electrical, Solar Energy & Automation Solutions
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 space-y-0.5 leading-tight">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span><strong>HQ / Central Warehouse:</strong> Plot 48, Spintex Heavy Industrial Area, Accra, Ghana</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>+233 24 100 0001 / +233 24 400 1100</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>sales@centricsystems.gh | info@centricsystems.gh</span>
                  </p>
                  <p className="font-mono text-slate-500 text-[10px]">
                    <strong>GRA TIN:</strong> C0049281726 | <strong>Business Reg:</strong> CS-GH-2023-88192
                  </p>
                </div>
              </div>

              {/* Document Meta Box */}
              <div className="sm:text-right bg-slate-50 p-2.5 sm:p-3 print:p-2 rounded-lg border border-slate-200 min-w-[200px]">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-md">
                  {docTitle}
                </span>
                <div className="mt-1 text-xs font-bold text-slate-900 font-mono">
                  {docType === 'quotation' ? invoice_number.replace('INV', 'QTE') : invoice_number}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500 flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formattedDate}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-700">
                  <strong>Origin Branch:</strong> {location_name}
                </div>
              </div>
            </div>

            {/* Bill To & Transaction Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 print:my-2 text-xs">
              <div className="bg-slate-50 p-3 print:p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Billed To Customer</span>
                <h3 className="text-xs font-bold text-slate-900 mt-0.5">{customer_name}</h3>
                {customer_phone && <p className="text-slate-600 text-[11px] mt-0.5">Phone: {customer_phone}</p>}
                <p className="text-slate-500 text-[11px] mt-0.5">Terms: {payment_mode === 'credit' ? 'Buy Now, Pay Later' : 'Direct Settlement'}</p>
              </div>

              <div className="bg-slate-50 p-3 print:p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Transaction Details</span>
                <div className="grid grid-cols-2 gap-2 mt-0.5 text-[11px]">
                  <div>
                    <span className="text-slate-500">Payment:</span>
                    <p className="font-semibold text-slate-900 uppercase">
                      {payment_mode === 'credit' ? 'Buy Now, Pay Later' : payment_mode === 'momo' ? 'MTN MoMo' : 'Cash'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Cashier:</span>
                    <p className="font-semibold text-slate-900">{cashier_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <p className="font-semibold text-emerald-700">Completed & Verified</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Branch:</span>
                    <p className="font-semibold text-slate-900">{location_name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto my-3 print:my-2 border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <th className="py-1.5 px-3">#</th>
                    <th className="py-1.5 px-3">Item & Specification</th>
                    <th className="py-1.5 px-3">SKU</th>
                    <th className="py-1.5 px-3 text-center">Qty</th>
                    <th className="py-1.5 px-3 text-right">Unit Price (GHS)</th>
                    <th className="py-1.5 px-3 text-right">Total (GHS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="py-1.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-semibold text-slate-900 text-xs">{item.product_name}</td>
                      <td className="py-1.5 px-3 font-mono text-[10px] text-slate-500">{item.sku}</td>
                      <td className="py-1.5 px-3 text-center font-bold text-xs">{item.quantity}</td>
                      <td className="py-1.5 px-3 text-right font-mono text-xs">
                        {Number(item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-1.5 px-3 text-right font-bold font-mono text-xs text-slate-950">
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
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mt-3 print:mt-2">
              <div className="w-full sm:w-1/2 text-xs text-slate-600 bg-slate-50 p-3 print:p-2.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-0.5">Payment Accounts</span>
                <p className="text-[11px]">
                  <strong>GCB Bank Ghana Ltd:</strong> Account #1141009823101 (Centric Systems Ghana Ltd)
                </p>
                <p className="text-[11px]">
                  <strong>MTN MoMo Merchant Till:</strong> 024 100 0001 (Centric Systems)
                </p>
                {notes && <p className="italic text-slate-500 pt-1 border-t border-slate-200 text-[10px]">Note: {notes}</p>}
              </div>

              <div className="w-full sm:w-5/12 bg-slate-50 p-3 print:p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
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
                <div className="pt-1.5 border-t border-slate-300 flex justify-between items-center text-xs font-extrabold text-slate-950">
                  <span>Grand Total:</span>
                  <span className="text-sm text-emerald-800 font-mono">
                    GHS ₵{Number(total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {docType === 'receipt' && (
                  <div className="pt-1 border-t border-slate-200 flex justify-between text-[11px] text-slate-700 font-semibold">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-emerald-700">
                      ₵{Number(amount_paid || total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Stamp & Signatory Footer */}
            <div className="mt-3.5 print:mt-2.5 pt-2.5 print:pt-2 border-t border-slate-200 flex flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-emerald-600/60 flex items-center justify-center text-emerald-700 p-1 text-center text-[7px] font-bold uppercase tracking-tighter shrink-0">
                  CENTRIC OFFICIAL VALIDATED
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-[11px]">Centric Systems Ghana Limited</p>
                  <p className="text-[10px]">System Generated & Authenticated Record</p>
                </div>
              </div>

              <div className="text-right">
                <div className="w-40 border-b border-slate-400 pb-0.5 mb-0.5 font-mono text-[9px] text-slate-400">
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
