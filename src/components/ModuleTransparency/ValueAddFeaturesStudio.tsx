import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  RefreshCw, 
  DollarSign, 
  Scale, 
  FileCheck2, 
  Building2, 
  Car, 
  HeartHandshake, 
  Flame, 
  Activity, 
  Sliders, 
  Eye, 
  Zap, 
  ChevronRight 
} from 'lucide-react';
import { UserPolicy, ValueAddPolicyFeature } from '../../types';
import { BUILTIN_VALUE_ADD_FEATURES } from '../../data/mockData';

interface ValueAddFeaturesStudioProps {
  policy: UserPolicy;
  onUpdatePolicy: (updated: Partial<UserPolicy>) => void;
}

export const ValueAddFeaturesStudio: React.FC<ValueAddFeaturesStudioProps> = ({
  policy,
  onUpdatePolicy,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'high_impact' | 'service'>('all');
  const [features, setFeatures] = useState<ValueAddPolicyFeature[]>(BUILTIN_VALUE_ADD_FEATURES);
  const [savedNotice, setSavedNotice] = useState(false);

  // Interactive Sandboxes State
  const [selectedSandbox, setSelectedSandbox] = useState<string>('rcv_vs_acv');
  
  // Sandbox 1: RCV vs ACV Simulator
  const [assetAgeYears, setAssetAgeYears] = useState<number>(4);
  const [originalAssetCost, setOriginalAssetCost] = useState<number>(18000); // e.g. Architectural Roof or High-end setup
  
  // Sandbox 2: Extended Rebuilding Disaster Surge
  const [baseDwelling, setBaseDwelling] = useState<number>(policy.dwellingLimit || 450000);
  const [surgeTier, setSurgeTier] = useState<number>(25);

  // Sandbox 3: No Room Rent Cap Healthcare
  const [hospitalRoomCharge, setHospitalRoomCharge] = useState<number>(3500);
  const [totalHospitalBill, setTotalHospitalBill] = useState<number>(48000);

  // Toggle Feature State
  const handleToggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  // Change Config Option
  const handleChangeConfigOption = (id: string, value: string | number) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === id && f.configurableOption) {
          return {
            ...f,
            configurableOption: {
              ...f.configurableOption,
              value,
            },
          };
        }
        return f;
      })
    );
  };

  // Calculate Net Delta
  const calculateTotalValueAddDelta = () => {
    return features.reduce((sum, f) => {
      if (!f.isEnabled) return sum;
      let cost = f.monthlyCost;
      if (f.configurableOption?.options) {
        const selected = f.configurableOption.options.find(
          (o) => o.value === f.configurableOption?.value
        );
        if (selected) {
          cost = selected.costDelta;
        }
      }
      return sum + cost;
    }, 0);
  };

  const netDelta = calculateTotalValueAddDelta();

  const handleApplyAllFeatures = () => {
    // Synchronize to policy state
    const rcv = features.find((f) => f.id === 'rcv_vs_acv')?.isEnabled ?? true;
    const extRebuild = Number(features.find((f) => f.id === 'extended_rebuilding')?.configurableOption?.value) || 25;
    const dedWaiver = features.find((f) => f.id === 'deductible_waivers')?.isEnabled ?? true;
    const autoRestore = features.find((f) => f.id === 'auto_restore_benefits')?.isEnabled ?? true;
    const umbrella = Number(features.find((f) => f.id === 'umbrella_compatibility')?.configurableOption?.value) || 1000000;
    const umUim = features.find((f) => f.id === 'um_uim_coverage')?.isEnabled ?? true;
    const noRoomRent = features.find((f) => f.id === 'no_room_rent_capping')?.isEnabled ?? true;
    const inflation = Number(features.find((f) => f.id === 'inflation_guard')?.configurableOption?.value) || 5;
    const directBilling = features.find((f) => f.id === 'direct_vendor_billing')?.isEnabled ?? true;
    const multiBundle = features.find((f) => f.id === 'multi_policy_bundling')?.isEnabled ?? true;

    onUpdatePolicy({
      valueAddFeatures: {
        rcvEnabled: rcv,
        extendedRebuildingPercent: extRebuild,
        deductibleWaiverActive: dedWaiver,
        autoRestoreBenefits: autoRestore,
        umbrellaCompatibilityLimit: umbrella,
        uninsuredMotoristEndorsement: umUim,
        noRoomRentCapping: noRoomRent,
        inflationGuardPercent: inflation,
        directVendorBilling247: directBilling,
        multiPolicyLoyaltyBundling: multiBundle,
      },
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const filteredFeatures = features.filter((f) =>
    activeCategory === 'all' ? true : f.category === activeCategory
  );

  // Depreciation Math for ACV vs RCV
  const annualDepreciationPercent = 0.12; // 12% per year
  const totalDepreciation = Math.min(0.75, assetAgeYears * annualDepreciationPercent);
  const acvPayout = Math.round(originalAssetCost * (1 - totalDepreciation));
  const rcvPayout = originalAssetCost;
  const lostDepreciationClawback = rcvPayout - acvPayout;

  // Extended Rebuilding Math
  const extendedCap = Math.round(baseDwelling * (1 + surgeTier / 100));
  const unlockedSurgeCapital = extendedCap - baseDwelling;

  // Health Room Rent Math (1% limit vs No Cap)
  const roomRent1PercentDailyLimit = Math.round(baseDwelling * 0.001); // typical legacy 1% sum insured limit = ~$450/day
  const dailyRoomPenalty = Math.max(0, hospitalRoomCharge - roomRent1PercentDailyLimit);
  const legacyProportionateDeduction = dailyRoomPenalty > 0 ? Math.round(totalHospitalBill * 0.42) : 0;
  const legacyHospitalPayout = totalHospitalBill - legacyProportionateDeduction;
  const aequitasHospitalPayout = totalHospitalBill;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Nobel-Grade Insurance Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Core Value-Add Policy Features & High-Impact Endorsements
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Every critical protection built directly into the protocol: from <strong>Replacement Cost (RCV)</strong> and <strong>Extended Rebuilding Surge Caps</strong> to <strong>$0 Deductible Waivers</strong> and <strong>UM/UIM Shields</strong> without hidden legacy gotchas.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-indigo-200">Value-Add Net Impact</span>
            <div className="text-3xl font-extrabold text-emerald-300 font-mono mt-0.5">
              {netDelta >= 0 ? `+$${netDelta.toFixed(2)}` : `-$${Math.abs(netDelta).toFixed(2)}`}
              <span className="text-xs font-normal text-emerald-200">/mo</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">10 Built-In Protections Active</p>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            type="button"
            id="tab-valadd-all"
            onClick={() => setActiveCategory('all')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All 10 Protections ({features.length})
          </button>
          <button
            type="button"
            id="tab-valadd-core"
            onClick={() => setActiveCategory('core')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeCategory === 'core'
                ? 'bg-indigo-900 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            1. Core Policy Features (4)
          </button>
          <button
            type="button"
            id="tab-valadd-high-impact"
            onClick={() => setActiveCategory('high_impact')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeCategory === 'high_impact'
                ? 'bg-sky-900 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            2. High-Impact Endorsements (4)
          </button>
          <button
            type="button"
            id="tab-valadd-service"
            onClick={() => setActiveCategory('service')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap min-h-[38px] ${
              activeCategory === 'service'
                ? 'bg-teal-900 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            3. Service & Direct Rails (2)
          </button>
        </div>

        <button
          type="button"
          id="btn-sync-all-value-features"
          onClick={handleApplyAllFeatures}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer min-h-[38px] shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Synchronize to Live Policy</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center justify-between font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All 10 Core Value-Add Features & Protections successfully synchronized to your live policy!</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">Status: ACTIVE</span>
        </div>
      )}

      {/* Grid of 10 Value-Add Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredFeatures.map((feat) => {
          const isEnabled = feat.isEnabled;
          const isCore = feat.category === 'core';
          const isHighImpact = feat.category === 'high_impact';
          const isService = feat.category === 'service';

          return (
            <div
              key={feat.id}
              id={`card-feature-${feat.id}`}
              className={`border rounded-2xl p-6 transition-all duration-200 shadow-sm flex flex-col justify-between ${
                isEnabled
                  ? 'bg-white border-slate-200/90 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200/60 opacity-80'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        isCore 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                          : isHighImpact 
                          ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {isCore ? 'Core Protection' : isHighImpact ? 'High-Impact Endorsement' : 'Service & Billing Rail'}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        {feat.shortTag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-['Cabinet_Grotesk'] leading-snug">
                      {feat.name}
                    </h3>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    id={`toggle-${feat.id}`}
                    onClick={() => handleToggleFeature(feat.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-hidden ${
                      isEnabled ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                        isEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Description & User Benefit */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {feat.description}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900">User Value:</strong> {feat.userBenefit}
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Coverage Impact:</strong> {feat.coverageImpact}</span>
                  </div>
                </div>

                {/* Legacy Anti-Trap Comparison Box */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">Traditional Carrier Trap:</span> {feat.antiTrapComparison}
                  </div>
                </div>
              </div>

              {/* Bottom Configurable Options & Sandbox Link */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {feat.configurableOption?.options ? (
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                      Configuration Level:
                    </label>
                    <select
                      id={`select-${feat.id}`}
                      value={feat.configurableOption.value}
                      onChange={(e) => handleChangeConfigOption(feat.id, e.target.value)}
                      disabled={!isEnabled}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-teal-600 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {feat.configurableOption.options.map((opt) => (
                        <option key={opt.value.toString()} value={opt.value}>
                          {opt.label} ({opt.costDelta >= 0 ? `+$${opt.costDelta.toFixed(2)}/mo` : `-$${Math.abs(opt.costDelta).toFixed(2)}/mo`})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-500">
                    Monthly Actuarial Delta: <strong className="text-slate-900">{feat.monthlyCost >= 0 ? `+$${feat.monthlyCost.toFixed(2)}/mo` : `-$${Math.abs(feat.monthlyCost).toFixed(2)}/mo`}</strong>
                  </div>
                )}

                <button
                  type="button"
                  id={`btn-sandbox-${feat.id}`}
                  onClick={() => {
                    setSelectedSandbox(feat.id);
                    const el = document.getElementById('interactive-sandbox-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Simulate Claim Impact</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Claim Simulation Sandboxes */}
      <div id="interactive-sandbox-section" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold mb-1">
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              Live Interactive Actuarial Sandbox
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Cabinet_Grotesk']">
              Simulate Real-World Claims Under Aequitas vs. Legacy Insurers
            </h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedSandbox('rcv_vs_acv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                selectedSandbox === 'rcv_vs_acv'
                  ? 'bg-indigo-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              RCV vs ACV
            </button>
            <button
              type="button"
              onClick={() => setSelectedSandbox('extended_rebuilding')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                selectedSandbox === 'extended_rebuilding'
                  ? 'bg-indigo-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Extended Surge (+50%)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSandbox('no_room_rent_capping')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                selectedSandbox === 'no_room_rent_capping'
                  ? 'bg-indigo-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Zero Room-Rent Cap
            </button>
            <button
              type="button"
              onClick={() => setSelectedSandbox('multi_policy_bundling')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                selectedSandbox === 'multi_policy_bundling'
                  ? 'bg-indigo-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Single Deductible Storm
            </button>
          </div>
        </div>

        {/* Sandbox 1: RCV vs ACV Simulator */}
        {selectedSandbox === 'rcv_vs_acv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-indigo-700 uppercase font-semibold block">
                Scenario: 4-Year Old Damaged Architectural Roof or Gear
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag the age slider to see how traditional <strong>Actual Cash Value (ACV)</strong> depreciates your payout vs <strong>Aequitas Replacement Cost Value (RCV)</strong> which pays 100% for brand new materials.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-700 font-semibold">Asset / Roof Age:</span>
                  <span className="font-bold text-indigo-900">{assetAgeYears} Years Old</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={assetAgeYears}
                  onChange={(e) => setAssetAgeYears(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1 Year (12% Deprec)</span>
                  <span>4 Years (48% Deprec)</span>
                  <span>8 Years (75% Deprec)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-700 font-semibold">Brand New Replacement Cost:</span>
                  <span className="font-bold text-slate-900">${originalAssetCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="35000"
                  step="1000"
                  value={originalAssetCost}
                  onChange={(e) => setOriginalAssetCost(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Legacy ACV Card */}
              <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase font-mono">Traditional ACV Payout</span>
                  <span className="text-[10px] bg-rose-200/60 text-rose-800 px-2 py-0.5 rounded font-mono font-semibold">Depreciated</span>
                </div>
                <div className="text-3xl font-black text-rose-700 font-mono">
                  ${acvPayout.toLocaleString()}
                </div>
                <p className="text-[11px] text-rose-800 leading-snug">
                  Carriers deduct <strong>-${lostDepreciationClawback.toLocaleString()}</strong> for age. You must pay this out of your own pocket.
                </p>
              </div>

              {/* Aequitas RCV Card */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase font-mono">Aequitas RCV Payout</span>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">100% Brand New</span>
                </div>
                <div className="text-3xl font-black text-emerald-700 font-mono">
                  ${rcvPayout.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-900 leading-snug">
                  Zero deduction for age or wear. You receive the full invoice to replace with brand new materials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sandbox 2: Extended Rebuilding Disaster Surge */}
        {selectedSandbox === 'extended_rebuilding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-sky-700 uppercase font-semibold block">
                Scenario: Post-Wildfire / Hurricane 40% Construction Labor Surge
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a catastrophic event hits a region, lumber and contractor rates surge 30% to 50%. Standard insurance caps out, leaving a massive rebuilding deficit.
              </p>

              <div className="flex items-center gap-2">
                {[0, 25, 50].map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => setSurgeTier(percent)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                      surgeTier === percent
                        ? 'bg-sky-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {percent === 0 ? 'Standard (0%)' : `+${percent}% Buffer`}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase font-mono">Standard Policy Cap</span>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  ${baseDwelling.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">
                  Fixed ceiling. Rebuilding costs exceeding this nominal limit become consumer bankruptcy risk.
                </p>
              </div>

              <div className="bg-sky-50 border border-sky-300 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 uppercase font-mono">Aequitas Extended Cap</span>
                  <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded font-mono font-bold">+{surgeTier}% Surge</span>
                </div>
                <div className="text-3xl font-black text-sky-700 font-mono">
                  ${extendedCap.toLocaleString()}
                </div>
                <p className="text-[11px] text-sky-900">
                  Unlocks <strong>+${unlockedSurgeCapital.toLocaleString()}</strong> in surge capital to guarantee complete rebuilding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sandbox 3: No Room Rent Capping */}
        {selectedSandbox === 'no_room_rent_capping' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-emerald-700 uppercase font-semibold block">
                Scenario: Specialized ICU / Private Recovery Room
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional health insurers cap room rent at 1% of sum insured. If you choose a private room, they penalize the <em>entire</em> hospital bill proportionately (often cutting payouts by 40-50%).
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-700 font-semibold">Total Hospital & Surgery Bill:</span>
                  <span className="font-bold text-slate-900">${totalHospitalBill.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="100000"
                  step="5000"
                  value={totalHospitalBill}
                  onChange={(e) => setTotalHospitalBill(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase font-mono">Legacy 1% Room Cap Plan</span>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-mono font-bold">-42% Penalty</span>
                </div>
                <div className="text-3xl font-black text-rose-700 font-mono">
                  ${legacyHospitalPayout.toLocaleString()}
                </div>
                <p className="text-[11px] text-rose-900">
                  Proportionate deduction penalty leaves you with <strong>${legacyProportionateDeduction.toLocaleString()}</strong> out-of-pocket.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase font-mono">Aequitas Zero-Sublimit</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">100% Paid</span>
                </div>
                <div className="text-3xl font-black text-emerald-700 font-mono">
                  ${aequitasHospitalPayout.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-900">
                  No room-rent sublimits. Full hospital invoice settled directly via RTP rails with $0 proportionate deduction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sandbox 4: Multi-Policy Single Deductible */}
        {selectedSandbox === 'multi_policy_bundling' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-teal-700 uppercase font-semibold block">
                Scenario: Severe Hail Storm Damages Both Roof ($12k) and Car ($6k)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compound casualty events routinely damage both your property and vehicle. Legacy carriers force you to pay two separate deductibles. Aequitas consolidates to a single deductible.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-rose-900 uppercase font-mono">Separate Carrier Deductibles</span>
                <div className="text-3xl font-black text-rose-700 font-mono">
                  $2,000 Out-of-Pocket
                </div>
                <p className="text-[11px] text-rose-900">
                  Home Deductible ($1,000) + Auto Collision Deductible ($1,000) = $2,000 double penalty.
                </p>
              </div>

              <div className="bg-teal-50 border border-teal-300 rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-teal-900 uppercase font-mono">Aequitas Single Deductible</span>
                <div className="text-3xl font-black text-teal-700 font-mono">
                  $1,000 Total ($1k Saved)
                </div>
                <p className="text-[11px] text-teal-900">
                  Single consolidated deductible for the compound casualty event. Saves $1,000 instant cash.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
