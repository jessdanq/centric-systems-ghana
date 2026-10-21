import React, { useState } from 'react'
import { X, Copy, Check, Database, ShieldCheck } from 'lucide-react'

export function SchemaModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const [copied, setCopied] = useState(false)

  const schemaSnippet = `-- CENTRIC SYSTEMS GHANA LIMITED (SUPABASE POSTGRESQL SCHEMA)
-- Run this in your Supabase SQL Editor to initialize tables, RLS policies, and views.

-- 1. Locations
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    type location_type NOT NULL DEFAULT 'branch',
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. User Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'branch_staff',
    assigned_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Products Master
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Location Stock (Multi-branch inventory ledger)
CREATE TABLE public.location_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_location UNIQUE (location_id, product_id)
);

-- 5. Customer Balances Automated View
CREATE OR REPLACE VIEW public.customer_balances AS
SELECT 
    c.id AS customer_id,
    c.full_name,
    c.phone,
    c.credit_limit,
    COALESCE(SUM(CASE WHEN cl.entry_type = 'debit' THEN cl.amount ELSE -cl.amount END), 0.00) AS current_balance,
    (c.credit_limit - COALESCE(SUM(CASE WHEN cl.entry_type = 'debit' THEN cl.amount ELSE -cl.amount END), 0.00)) AS available_credit
FROM public.customers c
LEFT JOIN public.credit_ledger cl ON c.id = cl.customer_id
GROUP BY c.id, c.full_name, c.phone, c.credit_limit;

-- Full file available in: ./supabase_schema.sql`

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Database Tables & SQL Schema</h3>
              <p className="text-xs text-slate-500">
                PostgreSQL Tables, Views & Security Policies for Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy SQL'}
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

        {/* SQL Code Body */}
        <div className="overflow-y-auto p-6 bg-slate-50">
          <p className="text-xs text-slate-600 mb-3">
            The complete production SQL schema is generated in{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px] font-semibold">
              supabase_schema.sql
            </code>{' '}
            at the root of this project. Paste it into your Supabase project's SQL editor to deploy the full database backend with Ghanaian seed records.
          </p>

          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
            {schemaSnippet}
          </pre>
        </div>
      </div>
    </div>
  )
}
