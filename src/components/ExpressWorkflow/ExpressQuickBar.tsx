import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Scale, 
  Activity,
  Sliders,
  DollarSign
} from 'lucide-react';
import { UserPolicy } from '../../types';

interface ExpressQuickBarProps {
  onOpenExpressModal: (mode: 'instant_bind' | 'instant_claim' | 'rate_match') => void;
  onApplyPreset: (presetName: 'optimal' | 'budget' | 'fortress') => void;
  activePremium: number;
}

export const ExpressQuickBar: React.FC<ExpressQuickBarProps> = ({
  onOpenExpressModal,
  onApplyPreset,
  activePremium,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'optimal' | 'budget' | 'fortress'>('optimal');
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handle1ClickPreset = (presetKey: 'optimal' | 'budget' | 'fortress') => {
    setSelectedPreset(presetKey);
    onApplyPreset(presetKey);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2500);
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-6 py-2 sm:py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Speed Indicator & Time Saved */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[11px] sm:text-xs font-mono font-bold">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-300 animate-pulse" />
            <span>⚡ Ultra-Fast Mode</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-300 font-mono">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            <span className="hidden xs:inline text-slate-400">Avg. Flow:</span>
            <strong className="text-emerald-300">22s</strong>
            <span className="text-[9px] sm:text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              Saved ~45m
            </span>
          </div>
        </div>

        {/* Center: 1-Click Smart Presets (Zero-Fiddle) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full md:w-auto justify-start md:justify-center scrollbar-none py-0.5">
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase hidden xl:inline mr-1 shrink-0">
            1-Click:
          </span>
          <button
            type="button"
            id="quick-preset-optimal"
            onClick={() => handle1ClickPreset('optimal')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-[38px] ${
              selectedPreset === 'optimal'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-teal-300 shrink-0" />
            <span>Optimal ($43.60)</span>
          </button>

          <button
            type="button"
            id="quick-preset-budget"
            onClick={() => handle1ClickPreset('budget')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-[38px] ${
              selectedPreset === 'budget'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <TrendingDown className="w-3 h-3 text-emerald-300 shrink-0" />
            <span>Budget ($29.80)</span>
          </button>

          <button
            type="button"
            id="quick-preset-fortress"
            onClick={() => handle1ClickPreset('fortress')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-[38px] ${
              selectedPreset === 'fortress'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-indigo-300 shrink-0" />
            <span>Fortress ($62.40)</span>
          </button>
        </div>

        {/* Right: Instant Turbo Action Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            id="btn-fast-bind-quick"
            onClick={() => onOpenExpressModal('instant_bind')}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-[11px] sm:text-xs font-mono font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition-all cursor-pointer min-h-[38px]"
          >
            <Zap className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span>15s Bind</span>
          </button>

          <button
            type="button"
            id="btn-fast-claim-quick"
            onClick={() => onOpenExpressModal('instant_claim')}
            className="flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[11px] sm:text-xs font-mono font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer min-h-[38px]"
          >
            <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>30s Claim</span>
          </button>

          <button
            type="button"
            id="btn-fast-match-quick"
            onClick={() => onOpenExpressModal('rate_match')}
            className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[11px] sm:text-xs font-mono font-medium items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer min-h-[38px]"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Beat Rate</span>
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="text-center text-[11px] font-mono text-emerald-400 mt-1 animate-in fade-in flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Preset applied instantly across all 10 policy parameters & live rates in &lt; 0.1s!</span>
        </div>
      )}
    </div>
  );
};
