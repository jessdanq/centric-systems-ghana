import React, { useState } from 'react'
import {
  ShieldCheck,
  Building,
  User,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Database,
  Store,
  Boxes,
  CreditCard,
  Check
} from 'lucide-react'
import { DEMO_USERS } from '../data/initialData'
import { isSupabaseConfigured } from '../services/supabase'

export function Navbar({ currentUser, onSwitchUser, onResetData, onOpenSchemaModal }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isSupabaseLive = isSupabaseConfigured()

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  CENTRIC SYSTEMS
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GHANA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Multi-Branch Stock, POS & Credit ERP
              </p>
            </div>
          </div>

          {/* Right Tools & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Mode Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-400 font-mono">
                {isSupabaseLive ? 'Supabase Live Connected' : 'Simulated DB (Seed Active)'}
              </span>
            </div>

            {/* SQL Schema Viewer Button */}
            <button
              type="button"
              onClick={onOpenSchemaModal}
              title="View Supabase PostgreSQL Schema"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800 hidden sm:flex items-center gap-1.5 text-xs font-medium"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Supabase DDL</span>
            </button>

            {/* Reset Data Button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset state to initial Ghanaian seed data"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Active User Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                  {currentUser.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.role === 'owner' && (
                      <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentUser.role === 'owner'
                      ? 'Owner / Kwame Yeboah'
                      : currentUser.role === 'warehouse_manager'
                        ? 'Central Warehouse'
                        : currentUser.role === 'customer'
                          ? 'Customer Portal'
                          : currentUser.location_name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-40 text-xs">
                    <div className="px-3 py-2 border-b border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Role / Demo Persona:
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto py-1">
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
                            className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                              isCurrent
                                ? 'bg-emerald-950/40 text-emerald-300'
                                : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                user.role === 'owner'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : user.role === 'warehouse_manager'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : user.role === 'customer'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                      : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {user.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-bold truncate text-white">{user.name}</p>
                                {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{user.role_label}</p>
                              <p className="text-[9px] text-emerald-500 font-mono truncate">{user.location_name}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
