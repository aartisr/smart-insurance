import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign, 
  Sliders, 
  X, 
  FileText, 
  CreditCard, 
  Building2, 
  Car, 
  HeartHandshake, 
  TrendingDown, 
  AlertTriangle,
  UploadCloud,
  QrCode,
  Download,
  Share2
} from 'lucide-react';
import { UserPolicy, ClaimRecord } from '../../types';

interface ExpressFastTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: UserPolicy;
  onUpdatePolicy: (updated: Partial<UserPolicy>) => void;
  onAddClaim?: (claim: ClaimRecord) => void;
  defaultMode?: 'instant_bind' | 'instant_claim' | 'rate_match';
}

export const ExpressFastTrackModal: React.FC<ExpressFastTrackModalProps> = ({
  isOpen,
  onClose,
  policy,
  onUpdatePolicy,
  onAddClaim,
  defaultMode = 'instant_bind',
}) => {
  const [mode, setMode] = useState<'instant_bind' | 'instant_claim' | 'rate_match'>(defaultMode);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActiveTimer, setIsActiveTimer] = useState(false);
  
  // Instant Bind State
  const [bindStep, setBindStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedAssetPreset, setSelectedAssetPreset] = useState<'home_suburb' | 'condo_city' | 'ev_vehicle' | 'family_health'>('home_suburb');
  const [selectedPresetTier, setSelectedPresetTier] = useState<'optimal' | 'budget' | 'fortress'>('optimal');
  
  // Instant Claim State
  const [claimStep, setClaimStep] = useState<'upload' | 'analyzing' | 'settled'>('upload');
  const [claimCategory, setClaimCategory] = useState<'water' | 'glass' | 'collision' | 'gadget'>('water');
  const [claimPayoutAmount, setClaimPayoutAmount] = useState<number>(3450);

  // Rate Match State
  const [currentCarrier, setCurrentCarrier] = useState<'State Farm' | 'Geico' | 'Allstate' | 'Progressive'>('State Farm');
  const [carrierPremium, setCarrierPremium] = useState<number>(142);
  const [matchedSavings, setMatchedSavings] = useState<number>(98.40);
  const [rateMatchStep, setRateMatchStep] = useState<'compare' | 'switching' | 'switched'>('compare');

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  // Stopwatch timer for transparency of user time spent
  useEffect(() => {
    let interval: any = null;
    if (isOpen && (bindStep === 'processing' || claimStep === 'analyzing' || rateMatchStep === 'switching')) {
      setIsActiveTimer(true);
      interval = setInterval(() => {
        setSecondsElapsed((sec) => +(sec + 0.1).toFixed(1));
      }, 100);
    } else {
      setIsActiveTimer(false);
    }
    return () => clearInterval(interval);
  }, [isOpen, bindStep, claimStep, rateMatchStep]);

  if (!isOpen) return null;

  // Preset Configurations for 1-Click Zero-Friction Binding
  const presetDetails = {
    optimal: {
      title: 'Optimal Shield (Recommended)',
      desc: 'All 10 Value-Add protections, RCV 100%, +25% Rebuilding Surge, $1M Umbrella, $0 Glass Waiver.',
      monthly: 43.60,
      base: 78.00,
      annualRebate: 185,
    },
    budget: {
      title: 'Ultra-Budget Champion',
      desc: 'Maximum actuarial pass-through, $2,000 deductible, essential property & liability protections.',
      monthly: 29.80,
      base: 65.00,
      annualRebate: 140,
    },
    fortress: {
      title: 'High-Net-Worth Fortress',
      desc: '+$50% Rebuilding Surge, $2M Umbrella, Worldwide Zero-Deductible electronics rider, CPI guard.',
      monthly: 62.40,
      base: 110.00,
      annualRebate: 260,
    },
  };

  const assetPresets = {
    home_suburb: {
      label: 'Single Family Home',
      address: '742 Evergreen Terrace, Springfield, OR',
      icon: <Building2 className="w-4 h-4 text-teal-600" />,
      type: 'Home' as const,
      dwelling: 450000,
    },
    condo_city: {
      label: 'Urban Luxury Condo',
      address: '450 Mission St, Apt 28B, San Francisco, CA',
      icon: <Building2 className="w-4 h-4 text-sky-600" />,
      type: 'Home' as const,
      dwelling: 320000,
    },
    ev_vehicle: {
      label: 'Tesla Model Y / EV Fleet',
      address: 'Auto Telematics Stream • 98 Safety Score',
      icon: <Car className="w-4 h-4 text-indigo-600" />,
      type: 'Auto' as const,
      dwelling: 55000,
    },
    family_health: {
      label: 'Comprehensive Health Plan',
      address: 'Zero Room-Rent Cap • 100% Auto-Restoration',
      icon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
      type: 'Health/Life' as const,
      dwelling: 500000,
    },
  };

  // 1-Click Instant Policy Bind Handler
  const handleExecute15sInstantBind = () => {
    setBindStep('processing');
    setSecondsElapsed(0);

    setTimeout(() => {
      const selectedAsset = assetPresets[selectedAssetPreset];
      const selectedPlan = presetDetails[selectedPresetTier];

      onUpdatePolicy({
        policyHolder: 'Alex Mercer (Verified Fast-Pass)',
        address: selectedAsset.address,
        assetType: selectedAsset.type,
        dwellingLimit: selectedAsset.dwelling,
        activeMonthlyPremium: selectedPlan.monthly,
        baseMonthlyPremium: selectedPlan.base,
        status: 'ACTIVE',
        valueAddFeatures: {
          rcvEnabled: true,
          extendedRebuildingPercent: selectedPresetTier === 'fortress' ? 50 : 25,
          deductibleWaiverActive: true,
          autoRestoreBenefits: true,
          umbrellaCompatibilityLimit: selectedPresetTier === 'fortress' ? 2000000 : 1000000,
          uninsuredMotoristEndorsement: true,
          noRoomRentCapping: true,
          inflationGuardPercent: 5,
          directVendorBilling247: true,
          multiPolicyLoyaltyBundling: true,
        },
      });

      setBindStep('success');
    }, 1200);
  };

  // 1-Click Instant Claim Handler (<1.5s AI settlement)
  const handleExecute30sClaim = () => {
    setClaimStep('analyzing');
    setSecondsElapsed(0);

    setTimeout(() => {
      const newClaim: ClaimRecord = {
        id: `CLM-FAST-${Date.now().toString().slice(-4)}`,
        category: claimCategory === 'water' ? 'Water Incursion' : claimCategory === 'glass' ? 'Glass / Windshield' : claimCategory === 'collision' ? 'Collision' : 'Personal Electronics',
        date: new Date().toISOString().split('T')[0],
        description: claimCategory === 'water' ? 'Smart Sensor Verified Burst Pipe' : claimCategory === 'glass' ? 'Zero-Deductible Windshield Chip' : claimCategory === 'collision' ? 'Fender Bumper Restoration' : 'Insured Gadget Loss',
        claimedAmount: claimPayoutAmount,
        payoutAmount: claimPayoutAmount,
        fraudAnomalyScore: 2,
        status: 'SETTLED_INSTANT_RTP',
        processingTimeSeconds: 1.4,
        damageSeverity: 'MODERATE',
        rtpTransferId: `FED-RTP-${Math.floor(1000000 + Math.random() * 9000000)}`,
        cryptographicProofHash: `0xzk_${Math.random().toString(36).substring(2, 12)}`,
        computerVisionAnalysis: 'Vision AI Class-4 Damage Verified • Smart Sensor Incursion Corroborated • FedNow Settlement Complete',
      };

      if (onAddClaim) {
        onAddClaim(newClaim);
      }
      setClaimStep('settled');
    }, 1400);
  };

  // 1-Click Rate Match & Switch
  const handleExecuteRateMatchSwitch = () => {
    setRateMatchStep('switching');
    setSecondsElapsed(0);

    setTimeout(() => {
      const newMonthly = +(carrierPremium - matchedSavings).toFixed(2);
      onUpdatePolicy({
        activeMonthlyPremium: newMonthly,
        status: 'ACTIVE',
      });
      setRateMatchStep('switched');
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5 sm:gap-3 relative z-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold tracking-tight font-['Cabinet_Grotesk']">
                  Aequitas Ultra-Fast Track Hub
                </h3>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 font-bold">
                  &lt;30s Target
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 hidden xs:block">
                Zero paperwork, zero hold times, 1-click execution.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 min-h-[36px] min-w-[36px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-Speed Action Mode Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 sm:p-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono shrink-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => { setMode('instant_bind'); setBindStep('select'); }}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
              mode === 'instant_bind'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>15s Bind</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('instant_claim'); setClaimStep('upload'); }}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
              mode === 'instant_claim'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>30s Claim</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('rate_match'); setRateMatchStep('compare'); }}
            className={`flex-1 py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
              mode === 'rate_match'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>10s Match</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          {/* MODE 1: 15-SECOND INSTANT BIND */}
          {mode === 'instant_bind' && (
            <div className="space-y-5">
              {bindStep === 'select' && (
                <>
                  <div>
                    <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">
                      Step 1: Select Your Pre-Enriched Asset
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(Object.keys(assetPresets) as Array<keyof typeof assetPresets>).map((key) => {
                        const asset = assetPresets[key];
                        const isSelected = selectedAssetPreset === key;
                        return (
                          <div
                            key={key}
                            onClick={() => setSelectedAssetPreset(key)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {asset.icon}
                              <span className="text-xs font-bold text-slate-900 font-mono">{asset.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-1">{asset.address}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">
                      Step 2: Choose 1-Click Policy Package
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(Object.keys(presetDetails) as Array<keyof typeof presetDetails>).map((tierKey) => {
                        const tier = presetDetails[tierKey];
                        const isSelected = selectedPresetTier === tierKey;
                        return (
                          <div
                            key={tierKey}
                            onClick={() => setSelectedPresetTier(tierKey)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-50/90 border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">{tier.title}</span>
                                {tierKey === 'optimal' && (
                                  <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">BEST</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-600 mt-1 leading-snug">{tier.desc}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                              <span className="text-base font-black text-emerald-700 font-mono">${tier.monthly.toFixed(2)}<span className="text-[10px] font-normal text-slate-500">/mo</span></span>
                              <span className="text-[10px] text-slate-400 line-through font-mono">${tier.base}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">Expected time to active coverage: <strong>&lt; 15 seconds</strong></span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold">Zero Broker Tolls</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecute15sInstantBind}
                    className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Instant 1-Click Bind via FedNow / Apple Pay (${presetDetails[selectedPresetTier].monthly.toFixed(2)}/mo)</span>
                  </button>
                </>
              )}

              {bindStep === 'processing' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center animate-spin">
                    <Zap className="w-8 h-8 text-teal-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">
                    Binding Nobel-Tier Policy in Real-Time...
                  </h4>
                  <div className="space-y-1 text-xs text-slate-500 font-mono">
                    <p>✓ Geospatial Satellite Roof Telemetry Verified</p>
                    <p>✓ Open Banking Zero-Intermediary Rail Initialized</p>
                    <p>✓ 10 Core Value-Add Protections Provisioned</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Elapsed: {secondsElapsed}s</span>
                  </div>
                </div>
              )}

              {bindStep === 'success' && (
                <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 font-['Cabinet_Grotesk']">
                      🎉 Policy Successfully Bound & Active!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      Completed in <strong>14.2 seconds</strong> (Saved 44 mins vs legacy carrier). Your verifiable certificate of insurance is stored on-ledger.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Policy Certificate ID:</span>
                      <span className="font-bold text-slate-900">POL-FAST-2026-98102</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Monthly Pass-Through Premium:</span>
                      <span className="font-bold text-emerald-700">${presetDetails[selectedPresetTier].monthly.toFixed(2)}/mo</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Value Protections:</span>
                      <span className="font-bold text-indigo-700">10 Built-In Endorsements Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Rail:</span>
                      <span className="font-bold text-slate-900">FedNow Instant Clearing (0% Tolls)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold cursor-pointer transition-all"
                    >
                      Done & Close Fast Track
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: 30-SECOND INSTANT CLAIM */}
          {mode === 'instant_claim' && (
            <div className="space-y-5">
              {claimStep === 'upload' && (
                <>
                  <div>
                    <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">
                      Step 1: Select Incident Category
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {[
                        { id: 'water', label: 'Water Leak', amount: 3450 },
                        { id: 'glass', label: 'Windshield ($0)', amount: 680 },
                        { id: 'collision', label: 'Auto Bump', amount: 2200 },
                        { id: 'gadget', label: 'Damaged Gear', amount: 1800 },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setClaimCategory(cat.id as any);
                            setClaimPayoutAmount(cat.amount);
                          }}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            claimCategory === cat.id
                              ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div>{cat.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">${cat.amount}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drag and Drop Simulation Box */}
                  <div className="border-2 border-dashed border-sky-300 bg-sky-50/50 rounded-2xl p-6 text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Drag & Drop Damage Photo / Smart Sensor Evidence
                    </div>
                    <p className="text-[11px] text-slate-500">
                      AI computer vision analyzes geometry, materials, and IoT logs in 1.4 seconds.
                    </p>
                    <div className="inline-block bg-white px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-600 mt-2">
                      📎 sample_sensor_telemetry_incursion_report.json attached
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                    <span className="text-slate-600">Disbursement Rail:</span>
                    <span className="font-bold text-emerald-700">Instant FedNow Direct ACH ($0 Fee)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecute30sClaim}
                    className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Submit & Request Instant Auto-Payout (${claimPayoutAmount.toLocaleString()})</span>
                  </button>
                </>
              )}

              {claimStep === 'analyzing' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center animate-spin">
                    <Zap className="w-8 h-8 text-sky-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">
                    Sub-2-Second Vision & IoT Fraud Triage...
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Verifying water flow sensor logs • Fraud risk: 0.02% (GREEN)
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Elapsed: {secondsElapsed}s</span>
                  </div>
                </div>
              )}

              {claimStep === 'settled' && (
                <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 font-['Cabinet_Grotesk']">
                      ⚡ Claim Approved & ${claimPayoutAmount.toLocaleString()} Dispatched!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      Processed in <strong>1.4 seconds</strong> without human adjusters or paperwork delays.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">FedNow Reference:</span>
                      <span className="font-bold text-slate-900">FED-RTP-8921873-INSTANT</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Approved Payout Amount:</span>
                      <span className="font-bold text-emerald-700">${claimPayoutAmount.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deductible Status:</span>
                      <span className="font-bold text-teal-700">{claimCategory === 'glass' ? '$0 Glass Waiver Applied' : 'Standard Settled'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold cursor-pointer transition-all"
                    >
                      Close & Return to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: 10-SECOND RATE MATCH & SWITCH */}
          {mode === 'rate_match' && (
            <div className="space-y-5">
              {rateMatchStep === 'compare' && (
                <>
                  <div>
                    <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">
                      Select Your Current Legacy Insurer
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {(['State Farm', 'Geico', 'Allstate', 'Progressive'] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCurrentCarrier(c);
                            const rates = { 'State Farm': 142, 'Geico': 128, 'Allstate': 156, 'Progressive': 135 };
                            const oldRate = rates[c];
                            setCarrierPremium(oldRate);
                            setMatchedSavings(+(oldRate - 43.60).toFixed(2));
                          }}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            currentCarrier === c
                              ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div>{c}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">${carrierPremium}/mo</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Side by side comparison card */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-center space-y-1">
                      <span className="text-[11px] font-mono text-rose-800 font-bold uppercase block">{currentCarrier} Rate</span>
                      <div className="text-2xl font-black text-rose-700 font-mono">${carrierPremium}.00<span className="text-xs font-normal">/mo</span></div>
                      <p className="text-[10px] text-rose-600">Includes 40% broker margin, CEO bonuses & ad spends</p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-1 shadow-xs">
                      <span className="text-[11px] font-mono text-emerald-900 font-bold uppercase block">Aequitas Pass-Through</span>
                      <div className="text-2xl font-black text-emerald-700 font-mono">$43.60<span className="text-xs font-normal">/mo</span></div>
                      <p className="text-[10px] text-emerald-800 font-bold">Saves ${matchedSavings}/mo ($+{(matchedSavings * 12).toFixed(0)}/yr)</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteRateMatchSwitch}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>1-Click Switch & Save ${(matchedSavings * 12).toFixed(0)}/Year</span>
                  </button>
                </>
              )}

              {rateMatchStep === 'switching' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-spin">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">
                    Cancelling Legacy Policy & Porting Active Risk...
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Generating zero-friction cancellation notice & binding Aequitas rate...
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Elapsed: {secondsElapsed}s</span>
                  </div>
                </div>
              )}

              {rateMatchStep === 'switched' && (
                <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 font-['Cabinet_Grotesk']">
                      🎉 Switched in 8.6 Seconds!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      You are now saving <strong>${matchedSavings}/month ($+{(matchedSavings * 12).toFixed(0)}/year)</strong> with all 10 Core Value-Add protections active.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold cursor-pointer transition-all"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
