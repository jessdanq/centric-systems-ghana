import React, { useState } from 'react'
import {
  ShieldCheck,
  Building2,
  Truck,
  ShoppingCart,
  User,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  ChevronRight,
  Store,
  CreditCard
} from 'lucide-react'
import { DEMO_USERS } from '../data/initialData'
import { showNotification } from '../context/ToastContext'

export function LoginPage({ onLogin }) {
  const [loggingInId, setLoggingInId] = useState(null)

  const handleQuickLogin = (user) => {
    setLoggingInId(user.id)
    setTimeout(() => {
      onLogin(user)
      showNotification(`Welcome back, ${user.name}! Logged in as ${user.role_label}.`, 'success', 3000)
    }, 150)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">CENTRIC SYSTEMS</span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Ghana
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Electrical, Solar & Automation Supplies Management System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Demo Auto-Login Enabled</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto my-6 sm:my-8 space-y-7">
        {/* Banner / Instructions */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant 1-Click Testing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Centric Systems Ghana
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            No username or password required for testing. Tap any demo account below to instantly explore the system with that person's specific permissions and role.
          </p>
        </div>

        {/* Demo Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_USERS.map((user) => {
            const isOwner = user.role === 'owner'
            const isWarehouse = user.role === 'warehouse_manager'
            const isBranch = user.role === 'branch_staff'
            const isCustomer = user.role === 'customer'
            const isLoggingIn = loggingInId === user.id

            return (
              <div
                key={user.id}
                onClick={() => handleQuickLogin(user)}
                role="button"
                tabIndex={0}
                className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer p-5 flex flex-col justify-between group active:scale-[0.98] shadow-xs hover:shadow-lg ${
                  isOwner
                    ? 'border-emerald-300 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-200/50'
                    : isWarehouse
                      ? 'border-blue-300 hover:border-blue-500 hover:ring-2 hover:ring-blue-200/50'
                      : isCustomer
                        ? 'border-amber-300 hover:border-amber-500 hover:ring-2 hover:ring-amber-200/50'
                        : 'border-slate-200 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-100'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header: Avatar + Name + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs ${
                          isOwner
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isWarehouse
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : isCustomer
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                          {user.name}
                          {isOwner && <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-semibold block">
                          {user.role_label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location badge */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.location_name}</span>
                  </div>

                  {/* Role Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {isOwner && 'Full management control: restock approvals, sales across all shops, warehouse audit & contractor credit.'}
                    {isWarehouse && 'Spintex logistics: supplier container intake, stock arrivals, waybills, and delivery dispatches.'}
                    {isBranch && 'Point of Sale (POS) checkout, cash & MoMo receipts, shelf inventory, and restock requests.'}
                    {isCustomer && 'Registered contractor portal: view supplies taken upfront, payment history, and current balance.'}
                  </p>
                </div>

                {/* Instant Login Button */}
                <div className="pt-4 mt-3 border-t border-slate-100">
                  <div
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all shadow-xs ${
                      isOwner
                        ? 'bg-emerald-600 text-white group-hover:bg-emerald-700'
                        : isWarehouse
                          ? 'bg-blue-600 text-white group-hover:bg-blue-700'
                          : isCustomer
                            ? 'bg-amber-600 text-white group-hover:bg-amber-700'
                            : 'bg-slate-900 text-white group-hover:bg-emerald-600'
                    }`}
                  >
                    <span>{isLoggingIn ? 'Logging in...' : `Auto Login as ${user.name.split(' ')[0]}`}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Informational Callout */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center max-w-xl mx-auto text-xs text-slate-600 space-y-1 shadow-xs">
          <p className="text-slate-800 font-bold">Switching accounts or logging out later</p>
          <p className="text-slate-500">
            Once logged in, click your profile pill in the top-right navigation bar to switch between roles anytime or log back out to this page.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 border-t border-slate-200 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Centric Systems Ghana Limited • Spintex Central Warehouse • Medie • Lapaz • Kumasi</p>
      </footer>
    </div>
  )
}
