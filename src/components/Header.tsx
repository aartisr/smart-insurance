import React from 'react';
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
  Scale
} from 'lucide-react';
import { UserPolicy } from '../types';

export type AppModule = 'underwriting' | 'claims' | 'transparency' | 'cost_elimination' | 'comparator';

interface HeaderProps {
  activeModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  policy: UserPolicy;
  surplusWalletBalance?: number;
  monthlyPremium?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  policy,
  surplusWalletBalance,
  monthlyPremium,
}) => {
  const currentPremium = monthlyPremium ?? policy?.activeMonthlyPremium ?? 43.60;
  const basePremium = policy?.baseMonthlyPremium ?? 78.00;
  const surplusSaved = surplusWalletBalance ?? policy?.givebackSurplusAccrued ?? 246.50;

  const modulesList: { id: AppModule; label: string; badge?: string; icon: React.ReactNode }[] = [
    { 
      id: 'comparator', 
      label: 'Cheapest Rate Finder & Comparator', 
      badge: 'Auto/Home Matcher',
      icon: <Scale className="w-4 h-4 text-teal-600" /> 
    },
    { 
      id: 'underwriting', 
      label: '1. Underwriting & Risk Deflation', 
      badge: '-44% Deflated',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      id: 'claims', 
      label: '2. Claims & Fraud Defense', 
      badge: '<3s RTP',
      icon: <Zap className="w-4 h-4 text-sky-600" /> 
    },
    { 
      id: 'transparency', 
      label: '3. UX & Full Transparency', 
      badge: '0 Legalese',
      icon: <Sliders className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      id: 'cost_elimination', 
      label: '4. Tech Stack & 0-Margin Rails', 
      badge: '0% Tolls',
      icon: <CreditCard className="w-4 h-4 text-amber-600" /> 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Universal Branding & Live Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Architecture Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-500 p-[1px] shadow-sm">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-['Cabinet_Grotesk']">
                AEQUITAS
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                v2026.1.0 • NOBEL TIER
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Hyper-Frictionless Zero-Margin Insurance Protocol
            </p>
          </div>
        </div>

        {/* Dynamic Surplus & Policy Stats */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-medium">
              Live Policy Premium
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-base font-bold text-emerald-700 font-mono">
                ${currentPremium.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through font-mono">
                ${basePremium.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono font-medium">
                -44% deflated
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 font-medium">
                Giveback Surplus Wallet
              </div>
              <div className="text-sm font-bold text-teal-700 font-mono flex items-center gap-0.5">
                <DollarSign className="w-3.5 h-3.5 -mr-0.5 text-teal-600" />
                {surplusSaved.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>RTP Rail: <strong className="text-slate-900">FedNow / ACH Direct</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Module Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 overflow-x-auto scrollbar-none">
        <nav className="flex items-center space-x-1.5 py-2 min-w-max">
          {modulesList.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                id={`nav-module-${m.id}`}
                type="button"
                onClick={() => onSelectModule(m.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
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
      </div>
    </header>
  );
};

