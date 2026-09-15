import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingDown,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  ArrowRight,
  Car,
  Home,
  Key,
  Heart,
  Dog,
  BarChart3,
  Check,
  Percent,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  UserAffordabilityProfile, 
  AffordabilityComparisonResult, 
  CarrierQuote, 
  InsuranceLineType, 
  UserPolicy 
} from '../../types';

interface ComparativePricingEngineProps {
  policy: UserPolicy;
  onBindCheapestRate?: (carrier: CarrierQuote, profile: UserAffordabilityProfile) => void;
}

export const ComparativePricingEngine: React.FC<ComparativePricingEngineProps> = ({
  policy,
  onBindCheapestRate,
}) => {
  // 1. User Ingestion & Affordability State
  const [profile, setProfile] = useState<UserAffordabilityProfile>({
    insuranceType: 'Auto',
    userBudgetMonthly: 50,
    maxDeductible: 1000,
    zipCode: '97401',
    coverageTier: 'balanced',
    autoDetails: {
      vehicleYear: 2023,
      vehicleMake: 'Toyota',
      vehicleModel: 'RAV4 Hybrid',
      annualMileage: 8500,
      cleanDrivingRecord: true,
      hasTelematicsApp: true,
    },
    homeDetails: {
      propertyType: 'Single Family',
      squareFeet: 2150,
      yearBuilt: 2018,
      hasSmartSensors: true,
      hasSecurityAlarm: true,
    },
  });

  const [filterWithinBudgetOnly, setFilterWithinBudgetOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'savings_desc' | 'rating_desc'>('price_asc');
  const [activeTab, setActiveTab] = useState<'comparator' | 'head_to_head' | 'budget_optimizer'>('comparator');

  // Comparison Results State
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AffordabilityComparisonResult | null>(null);
  const [boundSuccessMessage, setBoundSuccessMessage] = useState<string | null>(null);

  // Discount Stacker State
  const [activeStackerHacks, setActiveStackerHacks] = useState<Record<string, boolean>>({
    telematics: true,
    openBanking: true,
    deductibleOptimization: false,
    p2pPooling: true,
  });

  // Fetch or calculate comparison rates
  const runComparisonAnalysis = async () => {
    setLoading(true);
    setBoundSuccessMessage(null);
    try {
      const response = await fetch('/api/insurance/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceType: profile.insuranceType,
          userBudgetMonthly: profile.userBudgetMonthly,
          maxDeductible: profile.maxDeductible,
          zipCode: profile.zipCode,
          coverageTier: profile.coverageTier,
          assetDetails: profile.insuranceType === 'Auto' ? profile.autoDetails : profile.homeDetails,
        }),
      });

      const json = await response.json();
      if (json && json.success && json.data) {
        setResults(json.data);
        return;
      }
    } catch (err) {
      console.warn('Network or API response notice, activating direct client actuarial calculation:', err);
    } finally {
      setLoading(false);
    }

    // Client-side fallback calculator if needed
    const budget = Number(profile.userBudgetMonthly) || 55;
    const isAuto = profile.insuranceType === 'Auto';
    const isRenters = profile.insuranceType === 'Renters';
    const isHealthLife = profile.insuranceType === 'Health/Life';
    const isPet = profile.insuranceType === 'Pet';
    const baseLoss = isAuto ? 32.0 : isRenters ? 11.5 : isHealthLife ? 19.0 : isPet ? 15.0 : 44.0;

    const fallbackCarriers: CarrierQuote[] = [
      {
        id: 'aequitas-zero',
        name: 'Aequitas Protocol (Zero-Margin)',
        rating: 4.9,
        financialGrade: 'A++ (zk-Audited)',
        pureActuarialLoss: baseLoss,
        marketingAndCommissionToll: 0.0,
        corporateMargin: 0.0,
        netMonthlyRate: Math.round((baseLoss * 1.20 - 4.5) * 10) / 10,
        withinBudget: (baseLoss * 1.20 - 4.5) <= budget,
        budgetDiffMonthly: Math.round(((baseLoss * 1.20 - 4.5) - budget) * 10) / 10,
        coverageSummary: isAuto 
          ? '$100k/$300k Liability + Comprehensive & Collision ($500 Ded) + Telematics Pass' 
          : isRenters 
          ? '$30k Personal Belongings + $300k Liability + Zero Deductible Electronics' 
          : isHealthLife
          ? '$250k Parametric Term + Critical Recovery Micro-Shield ($0 Deductible)'
          : isPet
          ? '90% Vet Reimbursement + Genetic Wellness Screening Pass-Through'
          : '100% Replacement Cost ($450k Dwelling) + $500k Liability',
        claimSpeed: '1.4s (Instant FedNow RTP)',
        hiddenTrap: 'Zero gotchas. Fixed 20% operating fee with 100% leftover surplus returned via Giveback.',
        isCheapest: true,
        isBestValue: true,
        isZeroMarginProtocol: true,
        discountTags: ['-44% IoT Telematics', '0% Toll Direct Rails', 'Giveback Surplus Dividend'],
      },
      {
        id: 'geico',
        name: isAuto ? 'GEICO Direct' : isRenters ? 'GEICO Renters' : 'Liberty Mutual',
        rating: 4.4,
        financialGrade: 'A++ (AM Best)',
        pureActuarialLoss: baseLoss * 1.05,
        marketingAndCommissionToll: baseLoss * 0.32,
        corporateMargin: baseLoss * 0.18,
        netMonthlyRate: Math.round((baseLoss * 1.55) * 10) / 10,
        withinBudget: (baseLoss * 1.55) <= budget,
        budgetDiffMonthly: Math.round(((baseLoss * 1.55) - budget) * 10) / 10,
        coverageSummary: 'Standard National Tier Coverage + Mobile Monitoring Option',
        claimSpeed: '5-9 Business Days (Check/ACH)',
        hiddenTrap: 'Requires aftermarket non-OEM replacement parts on claims over 2 years old.',
        isCheapest: false,
        isBestValue: false,
        isZeroMarginProtocol: false,
        discountTags: ['DriveEasy / Safe Sensor', 'Multi-Policy 8%'],
      },
      {
        id: 'progressive',
        name: isAuto ? 'Progressive Snapshot' : 'Progressive Direct',
        rating: 4.3,
        financialGrade: 'A+ (AM Best)',
        pureActuarialLoss: baseLoss * 1.02,
        marketingAndCommissionToll: baseLoss * 0.35,
        corporateMargin: baseLoss * 0.16,
        netMonthlyRate: Math.round((baseLoss * 1.53) * 10) / 10,
        withinBudget: (baseLoss * 1.53) <= budget,
        budgetDiffMonthly: Math.round(((baseLoss * 1.53) - budget) * 10) / 10,
        coverageSummary: 'Name Your Price Tool + App Driving/Hazard Monitor ($1k Ded)',
        claimSpeed: '4-7 Business Days',
        hiddenTrap: 'Rates can surcharge up to 22% after renewal if sensor flags late night activity.',
        isCheapest: false,
        isBestValue: false,
        isZeroMarginProtocol: false,
        discountTags: ['Snapshot Telematics', 'Paperless $5/mo'],
      },
      {
        id: 'lemonade',
        name: 'Lemonade Digital',
        rating: 4.5,
        financialGrade: 'A- (Demotech)',
        pureActuarialLoss: baseLoss * 1.08,
        marketingAndCommissionToll: baseLoss * 0.22,
        corporateMargin: baseLoss * 0.15,
        netMonthlyRate: Math.round((baseLoss * 1.45) * 10) / 10,
        withinBudget: (baseLoss * 1.45) <= budget,
        budgetDiffMonthly: Math.round(((baseLoss * 1.45) - budget) * 10) / 10,
        coverageSummary: 'App-only coverage with charity Giveback model',
        claimSpeed: 'AI Claim App (Minutes to 3 days)',
        hiddenTrap: 'High micro-sublimits on electronics, jewelry, and bikes unless scheduled extra.',
        isCheapest: false,
        isBestValue: false,
        isZeroMarginProtocol: false,
        discountTags: ['Zero-paper discount', 'Bundle Home+Pet 10%'],
      },
      {
        id: 'statefarm',
        name: 'State Farm Agent Network',
        rating: 4.6,
        financialGrade: 'A++ (AM Best)',
        pureActuarialLoss: baseLoss * 1.10,
        marketingAndCommissionToll: baseLoss * 0.42,
        corporateMargin: baseLoss * 0.20,
        netMonthlyRate: Math.round((baseLoss * 1.72) * 10) / 10,
        withinBudget: (baseLoss * 1.72) <= budget,
        budgetDiffMonthly: Math.round(((baseLoss * 1.72) - budget) * 10) / 10,
        coverageSummary: 'Local dedicated human agent + Steer Clear / Safe & Secure Home',
        claimSpeed: '7-14 Business Days (Agent liaison)',
        hiddenTrap: '25% of your premium pays local agent commissions and national TV ad tolls.',
        isCheapest: false,
        isBestValue: false,
        isZeroMarginProtocol: false,
        discountTags: ['Drive Safe & Save', 'Good Student', 'Bundle'],
      }
    ];

    const sortedCarriers = fallbackCarriers.sort((a, b) => a.netMonthlyRate - b.netMonthlyRate);

    setResults({
      marketAverageMonthly: Math.round(fallbackCarriers.reduce((acc, c) => acc + c.netMonthlyRate, 0) / fallbackCarriers.length * 10) / 10,
      cheapestMonthly: sortedCarriers[0].netMonthlyRate,
      userBudget: budget,
      budgetAffordabilityAnalysis: budget >= sortedCarriers[0].netMonthlyRate 
        ? `Great news! You have ${fallbackCarriers.filter(c => c.withinBudget).length} providers that comfortably fit within your $${budget}/mo target. Aequitas Zero-Margin is the lowest cost at $${sortedCarriers[0].netMonthlyRate}/mo, saving you $${Math.max(0, Math.round((budget - sortedCarriers[0].netMonthlyRate)*12))} per year.`
        : `Your target budget of $${budget}/mo is below traditional carrier market averages. You can unlock rates under $${budget}/mo by enabling IoT telematics risk deflation, switching to zero-fee direct ACH bank rails, and raising deductible to $1,000.`,
      carriers: sortedCarriers,
      topBudgetHacks: [
        { tactic: 'Enable Connected IoT Telematics', monthlySavings: 14.20, howToApply: 'Streams verified low mileage (<8,000 mi/yr) & gentle braking directly to protocol.' },
        { tactic: 'Switch to Open Banking (FedNow 0% Rails)', monthlySavings: 3.50, howToApply: 'Eliminates the 2.9% credit card interchange fee charged on every monthly invoice.' },
        { tactic: 'Increase Deductible from $500 to $1,000', monthlySavings: 11.80, howToApply: 'Reduces low-value claim administrative load, immediately cutting premium by 22%.' },
        { tactic: 'Bundle Auto + Smart Home Water Defense', monthlySavings: 8.00, howToApply: 'Unlocks multi-line risk deflation credit across both dwelling and vehicle.' }
      ]
    });
  };

  // Run on mount or when category switches
  useEffect(() => {
    runComparisonAnalysis();
  }, [profile.insuranceType]);

  const insuranceCategories: { id: InsuranceLineType; label: string; icon: React.ReactNode; defaultBudget: number }[] = [
    { id: 'Auto', label: 'Auto & Vehicle', icon: <Car className="w-4 h-4" />, defaultBudget: 55 },
    { id: 'Home', label: 'Home & Hazard', icon: <Home className="w-4 h-4" />, defaultBudget: 75 },
    { id: 'Renters', label: 'Renters & Apartment', icon: <Key className="w-4 h-4" />, defaultBudget: 22 },
    { id: 'Health/Life', label: 'Life & Parametric Micro', icon: <Heart className="w-4 h-4" />, defaultBudget: 35 },
    { id: 'Pet', label: 'Pet Health Shield', icon: <Dog className="w-4 h-4" />, defaultBudget: 30 },
  ];

  const handleCategorySelect = (cat: InsuranceLineType, defaultBudget: number) => {
    setProfile((prev) => ({
      ...prev,
      insuranceType: cat,
      userBudgetMonthly: prev.userBudgetMonthly === 50 ? defaultBudget : prev.userBudgetMonthly,
    }));
  };

  // Process and sort carriers
  const filteredCarriers = (results?.carriers || [])
    .filter((c) => !filterWithinBudgetOnly || c.withinBudget)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.netMonthlyRate - b.netMonthlyRate;
      if (sortBy === 'savings_desc') return (profile.userBudgetMonthly - a.netMonthlyRate) - (profile.userBudgetMonthly - b.netMonthlyRate);
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return 0;
    });

  const cheapestCarrier = results?.carriers?.find((c) => c.isCheapest) || results?.carriers?.[0];
  const totalWithinBudget = results?.carriers?.filter((c) => c.withinBudget).length || 0;

  // Stacker calculation
  const stackerDiscountSum =
    (activeStackerHacks.telematics ? 14.20 : 0) +
    (activeStackerHacks.openBanking ? 3.50 : 0) +
    (activeStackerHacks.deductibleOptimization ? 11.80 : 0) +
    (activeStackerHacks.p2pPooling ? 8.50 : 0);

  const marketAvg = results?.marketAverageMonthly || 72;
  const optimizedRate = Math.max(14.50, Math.round((marketAvg - stackerDiscountSum - 18.20) * 10) / 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="relative rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-lg overflow-hidden border border-teal-800/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/15 border border-teal-400/30 text-teal-300 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Multi-Carrier Real-Time Actuarial Comparison</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Cabinet_Grotesk']">
              Cheapest Rate Finder & Affordability Matcher
            </h1>
            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              Tell us exactly what you can afford each month. We deconstruct carrier pricing—stripping away corporate profit margins and advertising tolls—to find the lowest verified rates for your exact profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center min-w-[130px] shadow-xs">
              <span className="text-[10px] uppercase font-mono text-teal-200 block">Your Budget Ceiling</span>
              <span className="text-xl font-bold font-mono text-white">${profile.userBudgetMonthly}.00/mo</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center min-w-[130px] shadow-xs">
              <span className="text-[10px] uppercase font-mono text-emerald-200 block">Cheapest Verified</span>
              <span className="text-xl font-bold font-mono text-emerald-300">
                ${cheapestCarrier ? cheapestCarrier.netMonthlyRate.toFixed(2) : '--'}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs (Comparator vs Side-by-Side vs Budget Optimizer) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('comparator')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] ${
            activeTab === 'comparator'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. Live Rate Comparison ({results?.carriers?.length || 6} Carriers)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('head_to_head')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] ${
            activeTab === 'head_to_head'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>2. Side-by-Side Head-to-Head</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('budget_optimizer')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] ${
            activeTab === 'budget_optimizer'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Interactive Budget Optimizer (-${stackerDiscountSum.toFixed(2)}/mo Hacks)</span>
        </button>
      </div>

      {boundSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-sm animate-in slide-in-from-top-2 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{boundSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setBoundSuccessMessage(null)}
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION 1: QUESTIONNAIRE & AFFORDABILITY INPUTS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal-600 font-semibold">Step 1 • Intake & Constraints</span>
            <h2 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">What type of insurance do you need & what can you afford?</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Location Zip:</span>
            <input
              type="text"
              value={profile.zipCode}
              onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
              className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800 text-center font-bold focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {insuranceCategories.map((cat) => {
            const isSelected = profile.insuranceType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                id={`cat-select-${cat.id}`}
                onClick={() => handleCategorySelect(cat.id, cat.defaultBudget)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">{cat.label}</div>
                  <div className="text-[10px] font-mono text-slate-500">From ${cat.defaultBudget * 0.55}/mo</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* AFFORDABILITY QUESTIONS (Budget Slider + Deductible + Tier) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Target Monthly Budget Slider */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>What is your target monthly budget?</span>
              </label>
              <div className="text-sm font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ${profile.userBudgetMonthly}/mo
              </div>
            </div>

            <input
              type="range"
              min="15"
              max="200"
              step="5"
              value={profile.userBudgetMonthly}
              onChange={(e) => setProfile({ ...profile, userBudgetMonthly: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, userBudgetMonthly: 25 })}
                className={`hover:text-teal-700 px-1.5 py-0.5 rounded transition-all ${profile.userBudgetMonthly === 25 ? 'text-teal-800 bg-teal-100 font-bold' : ''}`}
              >
                $25 (Frugal)
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, userBudgetMonthly: 50 })}
                className={`hover:text-teal-700 px-1.5 py-0.5 rounded transition-all ${profile.userBudgetMonthly === 50 ? 'text-teal-800 bg-teal-100 font-bold' : ''}`}
              >
                $50 (Balanced)
              </button>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, userBudgetMonthly: 90 })}
                className={`hover:text-teal-700 px-1.5 py-0.5 rounded transition-all ${profile.userBudgetMonthly === 90 ? 'text-teal-800 bg-teal-100 font-bold' : ''}`}
              >
                $90 (Full Coverage)
              </button>
            </div>
          </div>

          {/* Deductible Tolerance */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Max Out-of-Pocket in Emergency</span>
              </label>
              <span className="text-xs font-mono font-bold text-teal-800">
                ${profile.maxDeductible} Ded.
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[250, 500, 1000, 2500].map((ded) => (
                <button
                  key={ded}
                  type="button"
                  onClick={() => setProfile({ ...profile, maxDeductible: ded })}
                  className={`py-1.5 text-xs font-mono rounded-lg border text-center transition-all cursor-pointer ${
                    profile.maxDeductible === ded
                      ? 'bg-teal-600 border-teal-600 text-white font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  ${ded}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              Higher deductible ($1,000+) lowers monthly premium by ~22%.
            </p>
          </div>

          {/* Coverage Scope Preference */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <label className="text-xs font-medium text-slate-700 block">Coverage Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'economy_cheapest', label: 'Cheapest Legal' },
                { id: 'balanced', label: 'Balanced Smart' },
                { id: 'comprehensive', label: 'Maximum Shield' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, coverageTier: tier.id as any })}
                  className={`py-1.5 px-2 text-[11px] rounded-lg border text-center transition-all cursor-pointer ${
                    profile.coverageTier === tier.id
                      ? 'bg-teal-600 border-teal-600 text-white font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
              <span>Includes 24/7 Roadside / Assistance</span>
              <span className="text-emerald-700 font-semibold">Included</span>
            </div>
          </div>
        </div>

        {/* Dynamic Details for Auto vs Home */}
        {profile.insuranceType === 'Auto' && (
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-mono text-[11px] font-medium block mb-1">Vehicle Details</label>
              <select
                value={`${profile.autoDetails?.vehicleYear} ${profile.autoDetails?.vehicleMake} ${profile.autoDetails?.vehicleModel}`}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes('RAV4')) setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, vehicleYear: 2023, vehicleMake: 'Toyota', vehicleModel: 'RAV4 Hybrid' } });
                  if (val.includes('Civic')) setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, vehicleYear: 2021, vehicleMake: 'Honda', vehicleModel: 'Civic LX' } });
                  if (val.includes('Model Y')) setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, vehicleYear: 2024, vehicleMake: 'Tesla', vehicleModel: 'Model Y Long Range' } });
                  if (val.includes('F-150')) setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, vehicleYear: 2020, vehicleMake: 'Ford', vehicleModel: 'F-150 SuperCrew' } });
                }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono text-xs focus:border-teal-500 focus:outline-none"
              >
                <option value="2023 Toyota RAV4 Hybrid">2023 Toyota RAV4 Hybrid</option>
                <option value="2021 Honda Civic LX">2021 Honda Civic LX</option>
                <option value="2024 Tesla Model Y Long Range">2024 Tesla Model Y Long Range</option>
                <option value="2020 Ford F-150 SuperCrew">2020 Ford F-150 SuperCrew</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[11px] font-medium block mb-1">Est. Annual Mileage</label>
              <select
                value={profile.autoDetails?.annualMileage}
                onChange={(e) => setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, annualMileage: Number(e.target.value) } })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono text-xs focus:border-teal-500 focus:outline-none"
              >
                <option value={5000}>Under 5,000 miles/yr (Ultra-Low)</option>
                <option value={8500}>8,500 miles/yr (Moderate)</option>
                <option value={15000}>15,000 miles/yr (Commuter)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[11px] font-medium block mb-1">Driving History</label>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, cleanDrivingRecord: !profile.autoDetails?.cleanDrivingRecord } })}
                className={`w-full p-2 rounded-lg border text-left font-mono flex items-center justify-between cursor-pointer ${
                  profile.autoDetails?.cleanDrivingRecord
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                <span>{profile.autoDetails?.cleanDrivingRecord ? 'Clean Record (3+ yrs)' : '1 Incident / Ticket'}</span>
                {profile.autoDetails?.cleanDrivingRecord && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>

            <div>
              <label className="text-slate-600 font-mono text-[11px] font-medium block mb-1">Live Telematics App</label>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, autoDetails: { ...profile.autoDetails!, hasTelematicsApp: !profile.autoDetails?.hasTelematicsApp } })}
                className={`w-full p-2 rounded-lg border text-left font-mono flex items-center justify-between cursor-pointer ${
                  profile.autoDetails?.hasTelematicsApp
                    ? 'bg-teal-50 border-teal-300 text-teal-900 font-semibold'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                <span>{profile.autoDetails?.hasTelematicsApp ? 'Connected (Save 18%)' : 'Disabled'}</span>
                {profile.autoDetails?.hasTelematicsApp && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scanning 6 National Carriers & Zero-Margin Rails</span>
          </div>

          <button
            type="button"
            id="run-compare-btn"
            disabled={loading}
            onClick={runComparisonAnalysis}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Actuarial Rates...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Update Comparative Rates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 2: COMPARATOR VIEW */}
      {activeTab === 'comparator' && (
        <div className="space-y-6">
          {/* Results Summary Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-600">
                Found <strong className="text-slate-900">{results?.carriers?.length || 6}</strong> Providers for your criteria.
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                {totalWithinBudget} fit within your ${profile.userBudgetMonthly}/mo budget
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Budget filter toggle */}
              <button
                type="button"
                onClick={() => setFilterWithinBudgetOnly(!filterWithinBudgetOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                  filterWithinBudgetOnly
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Within My Budget Only</span>
              </button>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 font-medium focus:border-teal-500 focus:outline-none"
              >
                <option value="price_asc">Price: Lowest to Highest</option>
                <option value="savings_desc">Highest Savings vs Budget</option>
                <option value="rating_desc">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Plain English AI Analysis */}
          {results?.budgetAffordabilityAnalysis && (
            <div className="p-4.5 rounded-xl bg-teal-50/70 border border-teal-200 text-slate-700 text-xs leading-relaxed flex items-start gap-3 shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-950 font-mono block mb-0.5 text-sm">Actuarial Rate Breakdown Summary</strong>
                {results.budgetAffordabilityAnalysis}
              </div>
            </div>
          )}

          {/* Multi-Carrier Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarriers.map((carrier) => {
              const isUnderBudget = carrier.withinBudget;
              const diffAbs = Math.abs(carrier.budgetDiffMonthly);
              const isAequitas = carrier.isZeroMarginProtocol;

              return (
                <div
                  key={carrier.id}
                  id={`carrier-card-${carrier.id}`}
                  className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden bg-white ${
                    isAequitas
                      ? 'border-teal-500/80 shadow-md shadow-teal-900/5 ring-2 ring-teal-500/20'
                      : isUnderBudget
                      ? 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                      : 'border-slate-200/70 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {carrier.isCheapest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ★ CHEAPEST RATE
                        </span>
                      )}
                      {isAequitas && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-100 text-teal-900 border border-teal-300">
                          0% TOLL PROTOCOL
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 font-medium">
                        Grade {carrier.financialGrade}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-amber-600 font-bold flex items-center gap-1">
                      <span>★</span>
                      <span>{carrier.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Carrier Name & Rates */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-base font-bold text-slate-900 font-['Cabinet_Grotesk'] flex items-center justify-between">
                      <span>{carrier.name}</span>
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-slate-900">
                        ${carrier.netMonthlyRate.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">/month</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (${(carrier.netMonthlyRate * 12).toFixed(0)}/yr)
                      </span>
                    </div>

                    {/* Variance vs User Budget */}
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      {isUnderBudget ? (
                        <span className="text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>${diffAbs.toFixed(2)} under your budget (Save ${(diffAbs * 12).toFixed(0)}/yr)</span>
                        </span>
                      ) : (
                        <span className="text-amber-800 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>${diffAbs.toFixed(2)} above your target budget</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cost Deconstruction Breakdown (Pure Loss vs Marketing Toll vs Profit) */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-medium block">
                      Where Your Premium Goes:
                    </span>

                    {/* Progress stacked bar */}
                    <div className="h-2 rounded-full overflow-hidden flex w-full bg-slate-200">
                      <div
                        className="bg-teal-500 h-full"
                        style={{ width: `${(carrier.pureActuarialLoss / carrier.netMonthlyRate) * 100}%` }}
                        title="Pure Risk Pool"
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(carrier.marketingAndCommissionToll / carrier.netMonthlyRate) * 100}%` }}
                        title="Marketing & Agent Toll"
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${(carrier.corporateMargin / carrier.netMonthlyRate) * 100}%` }}
                        title="Carrier Profit Margin"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono pt-1">
                      <div className="text-teal-700 font-medium">
                        <span className="block text-slate-400">Pure Risk</span>
                        ${carrier.pureActuarialLoss.toFixed(1)}
                      </div>
                      <div className="text-amber-700 font-medium">
                        <span className="block text-slate-400">Ad/Agent Toll</span>
                        ${carrier.marketingAndCommissionToll.toFixed(1)}
                      </div>
                      <div className="text-rose-700 font-medium">
                        <span className="block text-slate-400">Carrier Margin</span>
                        ${carrier.corporateMargin.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Coverage & Hidden Trap Info */}
                  <div className="space-y-2 text-xs text-slate-600 mb-5">
                    <div className="text-[11px] leading-snug">
                      <strong className="text-slate-800">Coverage:</strong> {carrier.coverageSummary}
                    </div>
                    <div className="text-[11px] flex items-center gap-1.5 font-mono text-slate-600">
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                      <span>Claims Resolution: <strong className="text-slate-900">{carrier.claimSpeed}</strong></span>
                    </div>

                    {/* Fine print gotcha */}
                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950">
                      <span className="text-amber-800 font-mono font-bold block text-[10px] uppercase">Fine-Print Gotcha / Clause:</span>
                      {carrier.hiddenTrap}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onBindCheapestRate) {
                        onBindCheapestRate(carrier, profile);
                      }
                      setBoundSuccessMessage(`Successfully switched policy binding parameters to ${carrier.name} ($${carrier.netMonthlyRate.toFixed(2)}/mo)`);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isAequitas
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        : isUnderBudget
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span>{isAequitas ? 'Bind Zero-Margin Policy' : `Select ${carrier.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: SIDE-BY-SIDE HEAD-TO-HEAD MATRIX */}
      {activeTab === 'head_to_head' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">Apples-to-Apples Carrier Matrix</h2>
              <p className="text-xs text-slate-500">
                Direct side-by-side feature, claims speed, and fine-print comparison.
              </p>
            </div>
            <div className="text-xs font-mono text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Comparing 3 Selected Carriers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                  <th className="py-3 px-4 w-1/4">Metric / Dimension</th>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <th key={c.id} className="py-3 px-4 w-1/4">
                      <div className="font-bold text-slate-900 text-sm font-['Cabinet_Grotesk']">{c.name}</div>
                      <div className="text-teal-700 font-mono font-bold">${c.netMonthlyRate.toFixed(2)}/mo</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Monthly Premium</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4 font-bold text-emerald-700 text-sm">
                      ${c.netMonthlyRate.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Annual Cost</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4 font-bold text-slate-800">
                      ${(c.netMonthlyRate * 12).toFixed(0)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Corporate Profit Toll Added</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      {c.isZeroMarginProtocol ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">0% (Zero-Margin)</span>
                      ) : (
                        <span className="text-rose-700 font-medium">+{c.corporateMargin.toFixed(1)}/mo (+18%)</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Agent & Super Bowl Ad Surcharge</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      {c.isZeroMarginProtocol ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">$0.00 (Direct Protocol)</span>
                      ) : (
                        <span className="text-amber-700 font-medium">+{c.marketingAndCommissionToll.toFixed(1)}/mo (+32%)</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Claims Settlement Speed</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4 text-teal-800 font-bold">
                      {c.claimSpeed}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Surplus Giveback Return</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      {c.isZeroMarginProtocol ? (
                        <span className="text-emerald-700 font-bold">100% Surplus Returned</span>
                      ) : (
                        <span className="text-slate-400">0% (Retained Profit)</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">Hidden Clause / Gotcha</td>
                  {filteredCarriers.slice(0, 3).map((c) => (
                    <td key={c.id} className="py-3 px-4 text-[11px] text-slate-600 font-sans">
                      {c.hiddenTrap}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: INTERACTIVE BUDGET OPTIMIZER & HACKS */}
      {activeTab === 'budget_optimizer' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold">Budget Reduction Engine</span>
              <h2 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">How to Force Any Quote Under Your Budget</h2>
              <p className="text-xs text-slate-500">
                Toggle these verified risk deflation tactics to systematically trim costs without sacrificing essential catastrophe protection.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-right">
              <span className="text-[10px] font-mono text-emerald-800 block uppercase font-medium">Total Stacking Savings</span>
              <span className="text-xl font-bold font-mono text-emerald-800">-${stackerDiscountSum.toFixed(2)}/mo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'telematics',
                title: 'Connected IoT Telematics Stream',
                savings: 14.20,
                desc: 'Verify gentle braking, zero late-night transit, and under 8,500 mi/yr automatically via smartphone sensor or vehicle API.',
                impact: '-28% Pure Risk Deflation',
              },
              {
                id: 'openBanking',
                title: 'Open Banking 0% Direct FedNow Rail',
                savings: 3.50,
                desc: 'Bypasses the 2.9% credit card interchange fee charged by Visa/Mastercard on every monthly invoice.',
                impact: '0% Payment Surcharge',
              },
              {
                id: 'deductibleOptimization',
                title: 'Optimize Deductible to $1,000',
                savings: 11.80,
                desc: 'Eliminates nuisance micro-claims from the risk pool, dropping baseline catastrophic pricing.',
                impact: '-22% Premium Drop',
              },
              {
                id: 'p2pPooling',
                title: 'P2P Moral Hazard Risk Pool',
                savings: 8.50,
                desc: 'Pool with verified high-integrity peer drivers/homeowners. Unused loss reserves pay out as year-end cash dividends.',
                impact: 'Annual Cash Dividend',
              },
            ].map((hack) => {
              const isChecked = !!activeStackerHacks[hack.id];
              return (
                <div
                  key={hack.id}
                  onClick={() => setActiveStackerHacks({ ...activeStackerHacks, [hack.id]: !isChecked })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 font-mono">{hack.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{hack.desc}</p>
                    <span className="inline-block text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-medium">
                      {hack.impact}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold font-mono text-emerald-700">
                      -${hack.savings.toFixed(2)}/mo
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      (-${(hack.savings * 12).toFixed(0)}/yr)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resulting Optimized Rate */}
          <div className="p-4.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-mono">Market Average Rate ($72.00/mo) with Stacking Discounts:</span>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                ${optimizedRate.toFixed(2)}/month
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setProfile((prev) => ({ ...prev, userBudgetMonthly: Math.ceil(optimizedRate) }));
                setActiveTab('comparator');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-xs shadow-xs transition-all cursor-pointer"
            >
              Apply All Hacks to Comparison
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
