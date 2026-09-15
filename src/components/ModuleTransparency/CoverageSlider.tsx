import React, { useState } from 'react';
import { 
  Sliders, 
  TrendingDown, 
  CheckCircle2
} from 'lucide-react';
import { UserPolicy } from '../../types';

interface CoverageSliderProps {
  policy: UserPolicy;
  onUpdatePolicy: (updated: Partial<UserPolicy>) => void;
}

export const CoverageSlider: React.FC<CoverageSliderProps> = ({ policy, onUpdatePolicy }) => {
  const [dwelling, setDwelling] = useState(policy.dwellingLimit || 450000);
  const [personalProperty, setPersonalProperty] = useState(policy.personalPropertyLimit || 175000);
  const [liability, setLiability] = useState(policy.liabilityLimit || 500000);
  const [deductible, setDeductible] = useState(policy.deductible || 1000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected Riders
  const [selectedRiders, setSelectedRiders] = useState<{ [key: string]: boolean }>({
    flood: true,
    electronics: true,
    cyber: false,
    solar: false,
  });

  const ridersList = [
    { id: 'flood', name: 'Parametric Flash Flood & Surge Rider', cost: 3.50, limit: '$50,000 Direct Deposit' },
    { id: 'electronics', name: 'High-Value Electronics & Camera Gear', cost: 4.50, limit: '$15,000 Zero-Deductible' },
    { id: 'cyber', name: 'Personal Cyber Extortion & Identity Recovery', cost: 2.80, limit: '$100,000 Restoration' },
    { id: 'solar', name: 'Solar Rooftop & Home Battery Storage', cost: 3.20, limit: '$35,000 Grid Replacement' },
  ];

  // Mathematical zero-margin actuarial calculation
  const calculateRates = () => {
    const baseDwellingRate = (dwelling / 10000) * 1.15;
    const basePropertyRate = (personalProperty / 10000) * 0.45;
    const baseLiabilityRate = (liability / 100000) * 1.80;
    
    // Higher deductible reduces pure actuarial exposure
    const deductibleFactor = Math.max(0.65, 1 - (deductible - 500) * 0.00009);

    const ridersCost = ridersList.reduce((sum, r) => sum + (selectedRiders[r.id] ? r.cost : 0), 0);

    const baseGross = (baseDwellingRate + basePropertyRate + baseLiabilityRate + ridersCost);
    const actuarialNet = (baseGross * deductibleFactor);
    
    // IoT and Open Banking Deflations
    const netAequitas = Math.max(18.0, actuarialNet - policy.iotDiscountMonthly - policy.openBankingDiscountMonthly);
    const legacyCarrierQuote = actuarialNet * 1.62; // Legacy carriers add 35-40% broker margin & admin bloat

    const annualRebate = Math.round(netAequitas * 12 * 0.35);

    return {
      netMonthly: Number(netAequitas.toFixed(2)),
      legacyMonthly: Number(legacyCarrierQuote.toFixed(2)),
      annualRebate,
      monthlySavings: Number((legacyCarrierQuote - netAequitas).toFixed(2)),
    };
  };

  const currentCalc = calculateRates();

  const handleApplyChanges = () => {
    onUpdatePolicy({
      dwellingLimit: dwelling,
      personalPropertyLimit: personalProperty,
      liabilityLimit: liability,
      deductible,
      activeMonthlyPremium: currentCalc.netMonthly,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleRider = (id: string) => {
    setSelectedRiders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-mono mb-3">
              <Sliders className="w-3.5 h-3.5 text-teal-300" />
              Module 3: Interactive 'Coverage vs. Premium' Slider
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Granular Micro-Dollar Controls in Real Time
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              No hidden broker commissions or mysterious rate jumps. Adjust your coverage limits, riders, and deductibles to watch the exact mathematical price update down to the penny with <strong>100% transparent actuarial pass-through</strong>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-teal-200">Your Monthly Net Rate</span>
            <div className="text-3xl font-extrabold text-emerald-300 font-mono mt-0.5">
              ${currentCalc.netMonthly}
              <span className="text-xs font-normal text-emerald-200">/mo</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">vs ${currentCalc.legacyMonthly}/mo Legacy Carrier</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Granular Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
            {/* Slider 1: Dwelling Coverage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block font-['Cabinet_Grotesk']">
                    Dwelling Rebuilding Limit
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Guaranteed Replacement Cost for primary structure
                  </span>
                </div>
                <span className="text-sm font-bold text-teal-800 font-mono bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                  ${dwelling.toLocaleString()}
                </span>
              </div>
              <input
                id="slider-dwelling-limit"
                type="range"
                min="150000"
                max="1200000"
                step="25000"
                value={dwelling}
                onChange={(e) => setDwelling(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$150k</span>
                <span>$600k</span>
                <span>$1.2M</span>
              </div>
            </div>

            {/* Slider 2: Personal Property Floater */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block font-['Cabinet_Grotesk']">
                    Personal Property & Belongings
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Worldwide theft, water, and damage protection
                  </span>
                </div>
                <span className="text-sm font-bold text-teal-800 font-mono bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                  ${personalProperty.toLocaleString()}
                </span>
              </div>
              <input
                id="slider-personal-property"
                type="range"
                min="25000"
                max="400000"
                step="10000"
                value={personalProperty}
                onChange={(e) => setPersonalProperty(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$25k</span>
                <span>$200k</span>
                <span>$400k</span>
              </div>
            </div>

            {/* Slider 3: Personal Liability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block font-['Cabinet_Grotesk']">
                    Personal Liability Protection
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Covers legal defense & bodily injury claims
                  </span>
                </div>
                <span className="text-sm font-bold text-teal-800 font-mono bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                  ${liability.toLocaleString()}
                </span>
              </div>
              <input
                id="slider-liability-limit"
                type="range"
                min="100000"
                max="2000000"
                step="100000"
                value={liability}
                onChange={(e) => setLiability(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$100k</span>
                <span>$1M</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Slider 4: Deductible Optimization */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 font-['Cabinet_Grotesk']">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Policy Deductible (Self-Insured Retention)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Higher deductible lowers premium and grows your annual cash rebate
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-800 font-mono bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  ${deductible.toLocaleString()}
                </span>
              </div>
              <input
                id="slider-deductible"
                type="range"
                min="250"
                max="5000"
                step="250"
                value={deductible}
                onChange={(e) => setDeductible(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$250</span>
                <span>$2,500</span>
                <span>$5,000 (Max Surplus)</span>
              </div>
            </div>

            {/* Custom Scheduled Riders */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <span className="text-xs font-semibold text-slate-900 uppercase font-mono block">
                Optional Zero-Friction Riders
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ridersList.map((r) => {
                  const isChecked = !!selectedRiders[r.id];
                  return (
                    <button
                      key={r.id}
                      id={`toggle-rider-${r.id}`}
                      type="button"
                      onClick={() => toggleRider(r.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-teal-50 border-teal-400 text-slate-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-900">{r.name}</span>
                        <span className="text-[11px] font-mono text-teal-700 font-bold">+${r.cost.toFixed(2)}/mo</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1 font-mono">{r.limit}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Actuarial Surplus Matrix & Save Action */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between font-['Cabinet_Grotesk']">
              <span>Real-Time Actuarial Ledger</span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">Zero Margin</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                <span>Pure Actuarial Risk Base</span>
                <span className="text-slate-900 font-semibold">${(currentCalc.netMonthly + policy.iotDiscountMonthly + policy.openBankingDiscountMonthly).toFixed(2)}/mo</span>
              </div>

              <div className="flex items-center justify-between text-emerald-700 pb-2 border-b border-slate-100 font-semibold">
                <span>IoT Telematics Safe Discount</span>
                <span>-${policy.iotDiscountMonthly.toFixed(2)}/mo</span>
              </div>

              <div className="flex items-center justify-between text-teal-700 pb-2 border-b border-slate-100 font-semibold">
                <span>Open Banking Zero-Interchange Rail</span>
                <span>-${policy.openBankingDiscountMonthly.toFixed(2)}/mo</span>
              </div>

              <div className="flex items-center justify-between text-slate-900 font-bold text-sm pt-2">
                <span>Your Active Monthly Rate</span>
                <span className="text-emerald-700 text-lg font-mono">${currentCalc.netMonthly}/mo</span>
              </div>
            </div>

            {/* Giveback Potential Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1.5">
              <span className="text-[11px] font-mono text-emerald-800 uppercase block font-semibold">
                Projected Annual Giveback Cash Rebate
              </span>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                ${currentCalc.annualRebate}.00
              </div>
              <p className="text-[11px] text-slate-600 font-sans">
                If community pool claims remain low this quarter, this amount is automatically refunded directly to your bank.
              </p>
            </div>

            <button
              id="btn-apply-slider-adjustments"
              type="button"
              onClick={handleApplyChanges}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Update Policy Parameters Live</span>
            </button>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Policy parameters synchronized live!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
