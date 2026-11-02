import React, { useState } from 'react'
import {
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Database,
  Building2,
  Check,
  Sparkles,
  LogOut
} from 'lucide-react'
import { DEMO_USERS } from '../data/initialData'
import { isSupabaseConfigured } from '../services/supabase'

export function Navbar({ currentUser, onSwitchUser, onResetData, onOpenSchemaModal, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isSupabaseLive = isSupabaseConfigured()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  CENTRIC SYSTEMS
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  GHANA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Store Sales, Stock & Customer Credit
              </p>
            </div>
          </div>

          {/* Right Tools & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Mode Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-medium">
                {isSupabaseLive ? 'Connected to Cloud' : 'Ready (Sample Data Active)'}
              </span>
            </div>

            {/* SQL Schema Viewer Button */}
            <button
              type="button"
              onClick={onOpenSchemaModal}
              title="View Database Tables & SQL Schema"
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Database SQL</span>
            </button>

            {/* Reset Data Button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset sample data back to start"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Active User Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs transition-all text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                  {currentUser.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.role === 'owner' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {currentUser.role === 'owner'
                      ? 'Owner (Kwame Yeboah)'
                      : currentUser.role === 'warehouse_manager'
                        ? 'Central Warehouse'
                        : currentUser.role === 'customer'
                          ? 'Customer Account'
                          : currentUser.location_name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch User Account:
                      </span>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto py-1 divide-y divide-slate-50">
                      {DEMO_USERS.map((user) => {
                        const isCurrent = user.id === currentUser.id
                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              onSwitchUser(user)
                              setDropdownOpen(false)
                            }}
                            className={`w-full px-3.5 py-2 text-left flex items-start gap-2.5 transition-colors ${
                              isCurrent
                                ? 'bg-emerald-50 text-emerald-900 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                user.role === 'owner'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : user.role === 'warehouse_manager'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : user.role === 'customer'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {user.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-bold truncate text-slate-900">{user.name}</p>
                                {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{user.role_label}</p>
                              <p className="text-[10px] text-emerald-700 font-medium truncate">{user.location_name}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Log Out Option in Dropdown */}
                    <div className="p-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false)
                          if (onLogout) onLogout()
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out to Demo Login
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct Quick Log Out Button */}
            <button
              type="button"
              onClick={onLogout}
              title="Log Out to Demo Login Page"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
