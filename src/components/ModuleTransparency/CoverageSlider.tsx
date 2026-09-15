import React, { useState } from 'react';
import { 
  Sliders, 
  TrendingDown, 
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Info
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

  // 10 Built-In Value-Add Features & Endorsements State
  const [rcvEnabled, setRcvEnabled] = useState(policy.valueAddFeatures?.rcvEnabled ?? true);
  const [extendedRebuildPercent, setExtendedRebuildPercent] = useState(policy.valueAddFeatures?.extendedRebuildingPercent ?? 25);
  const [deductibleWaiver, setDeductibleWaiver] = useState(policy.valueAddFeatures?.deductibleWaiverActive ?? true);
  const [autoRestoreBenefits, setAutoRestoreBenefits] = useState(policy.valueAddFeatures?.autoRestoreBenefits ?? true);
  const [umbrellaLimit, setUmbrellaLimit] = useState(policy.valueAddFeatures?.umbrellaCompatibilityLimit ?? 1000000);
  const [umUimEnabled, setUmUimEnabled] = useState(policy.valueAddFeatures?.uninsuredMotoristEndorsement ?? true);
  const [noRoomRentCap, setNoRoomRentCap] = useState(policy.valueAddFeatures?.noRoomRentCapping ?? true);
  const [inflationGuardPercent, setInflationGuardPercent] = useState(policy.valueAddFeatures?.inflationGuardPercent ?? 5);
  const [directVendorBilling, setDirectVendorBilling] = useState(policy.valueAddFeatures?.directVendorBilling247 ?? true);
  const [multiPolicyBundle, setMultiPolicyBundle] = useState(policy.valueAddFeatures?.multiPolicyLoyaltyBundling ?? true);

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

    // Value-Add Features Costs & Discounts
    const rcvCost = rcvEnabled ? 3.20 : 0.00;
    const extRebuildCost = extendedRebuildPercent === 50 ? 4.60 : extendedRebuildPercent === 25 ? 2.80 : 0.00;
    const waiverCost = deductibleWaiver ? 1.90 : 0.00;
    const autoRestoreCost = autoRestoreBenefits ? 2.40 : 0.00;
    const umbrellaCost = umbrellaLimit >= 2000000 ? 7.50 : umbrellaLimit >= 1000000 ? 4.10 : 0.00;
    const umUimCost = umUimEnabled ? 3.60 : 0.00;
    const noRoomRentCost = noRoomRentCap ? 2.90 : 0.00;
    const inflationGuardCost = inflationGuardPercent > 0 ? (inflationGuardPercent >= 8 ? 2.40 : 1.50) : 0.00;
    const bundlingDiscount = multiPolicyBundle ? -6.50 : 0.00;

    const totalValueAddDelta = rcvCost + extRebuildCost + waiverCost + autoRestoreCost + umbrellaCost + umUimCost + noRoomRentCost + inflationGuardCost + bundlingDiscount;

    const baseGross = (baseDwellingRate + basePropertyRate + baseLiabilityRate + ridersCost + totalValueAddDelta);
    const actuarialNet = (baseGross * deductibleFactor);
    
    // IoT and Open Banking Deflations
    const netAequitas = Math.max(18.0, actuarialNet - policy.iotDiscountMonthly - policy.openBankingDiscountMonthly);
    const legacyCarrierQuote = (actuarialNet + 28.50) * 1.55; // Legacy carriers add 35-40% broker margin, ACV clawback penalty, and ad commissions

    const annualRebate = Math.round(netAequitas * 12 * 0.35);

    return {
      netMonthly: Number(netAequitas.toFixed(2)),
      legacyMonthly: Number(legacyCarrierQuote.toFixed(2)),
      annualRebate,
      monthlySavings: Number((legacyCarrierQuote - netAequitas).toFixed(2)),
      totalValueAddDelta: Number(totalValueAddDelta.toFixed(2)),
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
      valueAddFeatures: {
        rcvEnabled,
        extendedRebuildingPercent: extendedRebuildPercent,
        deductibleWaiverActive: deductibleWaiver,
        autoRestoreBenefits,
        umbrellaCompatibilityLimit: umbrellaLimit,
        uninsuredMotoristEndorsement: umUimEnabled,
        noRoomRentCapping: noRoomRentCap,
        inflationGuardPercent,
        directVendorBilling247: directVendorBilling,
        multiPolicyLoyaltyBundling: multiPolicyBundle,
      },
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
              Module 3: Interactive 'Coverage vs. Premium' Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Granular Controls with Built-in Core Value-Add Protections
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Adjust your coverage limits, deductibles, and built-in protections (<strong>RCV</strong>, <strong>Extended Rebuilding</strong>, <strong>$0 Deductible Waivers</strong>, <strong>UM/UIM</strong>, and <strong>Multi-Policy Bundles</strong>) to see real-time zero-margin actuarial pass-through.
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
        {/* Left Column: Interactive Granular Sliders & Built-In Value-Add Features */}
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
                    Baseline structural replacement cap ({extendedRebuildPercent > 0 ? `+${extendedRebuildPercent}% Surge Cap Active` : 'Standard'})
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
                    {rcvEnabled ? '100% Replacement Cost Value (RCV - No Depreciation)' : 'Actual Cash Value (ACV)'}
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
                    {umbrellaLimit >= 1000000 ? `Umbrella Compatible Shield ($${(umbrellaLimit/1000000).toFixed(0)}M Bridge)` : 'Base Liability'}
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
                    Policy Deductible {deductibleWaiver ? '(With $0 Glass/Accident Waiver)' : ''}
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

            {/* 10 Built-In Value-Add Policy Features Toggles */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase font-mono block">
                  Core Value-Add Policy Features & Endorsements
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                  10 Built-In Modules
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. RCV vs ACV */}
                <button
                  type="button"
                  id="toggle-rcv-feature"
                  onClick={() => setRcvEnabled(!rcvEnabled)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    rcvEnabled
                      ? 'bg-indigo-50/80 border-indigo-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Replacement Cost (RCV)</span>
                    <span className="text-[10px] font-mono text-indigo-700 font-bold">{rcvEnabled ? '100% Brand New' : 'Depreciated ACV'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Zero age deduction clawback on damaged property</span>
                </button>

                {/* 2. Extended Rebuilding Surge */}
                <div className="p-3 rounded-xl border bg-white border-slate-200 text-left space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Extended Rebuilding Buffer</span>
                    <span className="text-[10px] font-mono text-sky-700 font-bold">+{extendedRebuildPercent}% Cap</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 25, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setExtendedRebuildPercent(pct)}
                        className={`flex-1 py-1 rounded text-[10px] font-mono cursor-pointer ${
                          extendedRebuildPercent === pct ? 'bg-sky-900 text-white font-bold' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pct === 0 ? '0%' : `+${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Deductible Waiver */}
                <button
                  type="button"
                  id="toggle-deductible-waiver"
                  onClick={() => setDeductibleWaiver(!deductibleWaiver)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    deductibleWaiver
                      ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">$0 Glass & Safe-Driver Waiver</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">{deductibleWaiver ? 'Active' : 'Disabled'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">$0 out of pocket on windshield & first accident</span>
                </button>

                {/* 4. Automatic Restoration of Benefits */}
                <button
                  type="button"
                  id="toggle-auto-restore"
                  onClick={() => setAutoRestoreBenefits(!autoRestoreBenefits)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    autoRestoreBenefits
                      ? 'bg-teal-50/80 border-teal-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Auto Restoration of Benefits</span>
                    <span className="text-[10px] font-mono text-teal-700 font-bold">{autoRestoreBenefits ? 'Auto-Reset' : 'Off'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Resets limit to 100% after mid-year major claim</span>
                </button>

                {/* 5. UM/UIM Coverage */}
                <button
                  type="button"
                  id="toggle-um-uim"
                  onClick={() => setUmUimEnabled(!umUimEnabled)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    umUimEnabled
                      ? 'bg-sky-50/80 border-sky-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Uninsured Motorist (UM/UIM)</span>
                    <span className="text-[10px] font-mono text-sky-700 font-bold">{umUimEnabled ? 'Protected' : 'Off'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">100% protection against uninsured & hit-and-run</span>
                </button>

                {/* 6. Multi-Policy Bundling */}
                <button
                  type="button"
                  id="toggle-multi-bundle"
                  onClick={() => setMultiPolicyBundle(!multiPolicyBundle)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    multiPolicyBundle
                      ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Multi-Policy Single Deductible</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">{multiPolicyBundle ? '-15% Bundle' : 'Off'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">1 single deductible on storm damaging home & car</span>
                </button>
              </div>
            </div>

            {/* Custom Scheduled Riders */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <span className="text-xs font-semibold text-slate-900 uppercase font-mono block">
                Additional Parametric & Specialty Riders
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

              <div className="flex items-center justify-between text-indigo-700 pb-2 border-b border-slate-100 font-semibold">
                <span>Value-Add Features Delta</span>
                <span>{currentCalc.totalValueAddDelta >= 0 ? `+$${currentCalc.totalValueAddDelta.toFixed(2)}` : `-$${Math.abs(currentCalc.totalValueAddDelta).toFixed(2)}`}/mo</span>
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
                <span>Policy parameters & Value-Add Protections synchronized live!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

