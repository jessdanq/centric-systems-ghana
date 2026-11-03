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
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Info,
  KeyRound
} from 'lucide-react'
import { DEMO_USERS } from '../data/initialData'
import { showNotification } from '../context/ToastContext'

export function LoginPage({ onLogin }) {
  const [selectedUser, setSelectedUser] = useState(DEMO_USERS[0]) // Kwame by default
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loggingInId, setLoggingInId] = useState(null)

  // Sign In using the main form (with or without password)
  const handleFormSubmit = (e) => {
    e.preventDefault()
    setLoggingInId(selectedUser.id)
    setTimeout(() => {
      onLogin(selectedUser)
      showNotification(`Welcome back, ${selectedUser.name}! Signed in as ${selectedUser.role_label}.`, 'success', 3000)
    }, 150)
  }

  // 1-Click Instant Login from demo cards
  const handleDirectLogin = (user) => {
    setSelectedUser(user)
    setLoggingInId(user.id)
    setTimeout(() => {
      onLogin(user)
      showNotification(`Welcome back, ${user.name}! Signed in as ${user.role_label}.`, 'success', 3000)
    }, 150)
  }

  const handleForgotPassword = () => {
    showNotification(
      `Password Reset (Production Preview): An SMS reset code will be dispatched to ${selectedUser.phone} for verification.`,
      'info',
      4500
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 sm:py-3">
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
          <span>Demo & Testing Mode</span>
        </div>
      </header>

      {/* Main Grid: Left = Production Sign In Form, Right = 1-Click Demo Accounts */}
      <main className="max-w-7xl w-full mx-auto my-6 sm:my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Production Login Form (Simulates final project experience)   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Production Login Preview</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign In to Your Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Enter your staff credentials to access the Centric Systems ERP portal.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Account / Email Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Staff Email / User Account <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedUser.id}
                    onChange={(e) => {
                      const found = DEMO_USERS.find((u) => u.id === e.target.value)
                      if (found) setSelectedUser(found)
                    }}
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium appearance-none cursor-pointer"
                  >
                    {DEMO_USERS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role_label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Email text display */}
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                  <span className="font-mono text-slate-600">{selectedUser.email}</span>
                  <span className="font-medium text-emerald-700">{selectedUser.location_name}</span>
                </div>

                {/* Quick Avatar Switcher Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {DEMO_USERS.map((u) => {
                    const isSelected = selectedUser.id === u.id
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <span className="text-[10px] font-bold">{u.avatar}</span>
                        <span>{u.name.split(' ')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Password Input (Dummy Required - Can be left blank or filled) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Password</span>
                    <span className="text-rose-500 font-bold">*</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">(Required in production)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter any password (or leave blank to test)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Dummy password helper alert */}
                <div className="mt-2 flex items-start gap-2 text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80 leading-tight">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Testing Mode Note: </span>
                    Password verification is disabled for this test. You can type any dummy password or leave it completely blank to sign in.
                  </div>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">Keep me signed in on this device</span>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={Boolean(loggingInId)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loggingInId === selectedUser.id ? 'Signing in...' : `Sign In as ${selectedUser.name}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Enterprise Security Badge */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted ERP</span>
              </span>
              <span>Ghana Cedi (GH₵) POS</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 1-Click Demo Accounts (Fast testing for all 6 roles)        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  1-Click Auto Login Accounts
                </h2>
                <p className="text-xs text-slate-500">
                  Tap any account to instantly test with that person's exact dashboard and branch permissions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0 self-start sm:self-auto">
                6 Roles Available
              </span>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DEMO_USERS.map((user) => {
                const isOwner = user.role === 'owner'
                const isWarehouse = user.role === 'warehouse_manager'
                const isBranch = user.role === 'branch_staff'
                const isCustomer = user.role === 'customer'
                const isSelectedInForm = selectedUser.id === user.id
                const isLoggingIn = loggingInId === user.id

                return (
                  <div
                    key={user.id}
                    onClick={() => handleDirectLogin(user)}
                    role="button"
                    tabIndex={0}
                    className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer p-4 sm:p-5 flex flex-col justify-between group active:scale-[0.98] shadow-xs hover:shadow-md ${
                      isSelectedInForm
                        ? 'ring-2 ring-emerald-500 border-emerald-400'
                        : isOwner
                          ? 'border-emerald-300 hover:border-emerald-500'
                          : isWarehouse
                            ? 'border-blue-300 hover:border-blue-500'
                            : isCustomer
                              ? 'border-amber-300 hover:border-amber-500'
                              : 'border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Avatar + Name */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ${
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
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate flex items-center gap-1">
                              <span>{user.name}</span>
                              {isOwner && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" />}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-semibold block truncate">
                              {user.role_label}
                            </span>
                          </div>
                        </div>

                        {isSelectedInForm && (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            Selected
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{user.location_name}</span>
                      </div>

                      {/* Role summary */}
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {isOwner && 'Overall control: restock approvals, sales across all shops & customer credit.'}
                        {isWarehouse && 'Spintex logistics: supplier container intake, waybills & shop dispatches.'}
                        {isBranch && 'Counter POS checkout, cash & MoMo receipts, shelf stock & restock requests.'}
                        {isCustomer && 'Registered contractor portal: view supplies taken upfront & balance.'}
                      </p>
                    </div>

                    {/* Instant Login Button */}
                    <div className="pt-3 mt-2.5 border-t border-slate-100">
                      <div
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all shadow-xs ${
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
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center py-4 border-t border-slate-200 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Centric Systems Ghana Limited • Spintex Central Warehouse • Medie • Lapaz • Kumasi</p>
      </footer>
    </div>
  )
}
