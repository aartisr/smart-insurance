import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Zap, 
  FileText, 
  Sliders, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  Scale,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { UserPolicy } from '../types';

export type AppModule = 'underwriting' | 'claims' | 'transparency' | 'cost_elimination' | 'comparator';

interface HeaderProps {
  activeModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  policy: UserPolicy;
  surplusWalletBalance?: number;
  monthlyPremium?: number;
  onOpenExpressModal?: (mode: 'instant_bind' | 'instant_claim' | 'rate_match') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  policy,
  surplusWalletBalance,
  monthlyPremium,
  onOpenExpressModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPremium = monthlyPremium ?? policy?.activeMonthlyPremium ?? 43.60;
  const basePremium = policy?.baseMonthlyPremium ?? 78.00;
  const surplusSaved = surplusWalletBalance ?? policy?.givebackSurplusAccrued ?? 246.50;

  const modulesList: { id: AppModule; label: string; badge?: string; icon: React.ReactNode }[] = [
    { 
      id: 'comparator', 
      label: 'Cheapest Rate Finder', 
      badge: 'Auto/Home Matcher',
      icon: <Scale className="w-4 h-4 text-teal-600" /> 
    },
    { 
      id: 'underwriting', 
      label: '1. Underwriting', 
      badge: '-44% Deflated',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      id: 'claims', 
      label: '2. Claims & Triage', 
      badge: '<3s RTP',
      icon: <Zap className="w-4 h-4 text-sky-600" /> 
    },
    { 
      id: 'transparency', 
      label: '3. UX & Protections', 
      badge: '0 Legalese',
      icon: <Sliders className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      id: 'cost_elimination', 
      label: '4. Tech Stack Rails', 
      badge: '0% Tolls',
      icon: <CreditCard className="w-4 h-4 text-amber-600" /> 
    },
  ];

  const handleSelect = (id: AppModule) => {
    onSelectModule(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Universal Branding & Live Status Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Architecture Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-500 p-[1px] shadow-sm shrink-0">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 font-['Cabinet_Grotesk']">
                AEQUITAS
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                NOBEL TIER
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 hidden xs:block">
              Zero-Margin Insurance Protocol
            </p>
          </div>
        </div>

        {/* Dynamic Surplus & Policy Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col text-right">
            <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
              Live Rate
            </span>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-sm sm:text-base font-bold text-emerald-700 font-mono">
                ${currentPremium.toFixed(2)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-mono hidden xs:inline">
                ${basePremium.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2.5 shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase font-mono text-slate-500 font-medium">
                Surplus Wallet
              </div>
              <div className="text-xs sm:text-sm font-bold text-teal-700 font-mono flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 -mr-0.5 text-teal-600" />
                {surplusSaved.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 px-3 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="text-[10px] font-mono uppercase text-slate-400 px-2 font-bold mb-1">
            Switch Module
          </div>
          {modulesList.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelect(m.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-slate-900 text-white font-mono shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 font-sans border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {m.icon}
                  <span>{m.label}</span>
                </div>
                {m.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                    isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onOpenExpressModal && (
            <button
              type="button"
              onClick={() => {
                onOpenExpressModal('instant_bind');
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
            >
              <Zap className="w-4 h-4" />
              <span>Launch 30s Fast-Track Hub</span>
            </button>
          )}
        </div>
      )}

      {/* Desktop Primary Module Navigation Bar */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between gap-2">
          <nav className="flex items-center space-x-1.5 py-2 min-w-max">
            {modulesList.map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  id={`nav-module-${m.id}`}
                  type="button"
                  onClick={() => onSelectModule(m.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer min-h-[38px] ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-mono'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent font-sans'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                  {m.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                      isActive ? 'bg-slate-800 text-teal-300 border border-slate-700' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {onOpenExpressModal && (
            <button
              type="button"
              id="btn-header-express-fast-track"
              onClick={() => onOpenExpressModal('instant_bind')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-mono font-bold shadow-xs cursor-pointer transition-all shrink-0 min-h-[38px]"
            >
              <Zap className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>⚡ 30s Fast-Track Hub</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

