import React, { useState } from 'react';
import { 
  Check, 
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MonetizationTiers: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState('PRO');

  const tiers = [
    {
      id: 'BASIC',
      name: 'Essential Micro-Shield',
      fee: '$4.00',
      period: 'flat software fee/mo',
      badge: 'Zero-Margin Core',
      description: 'Pure actuarial pass-through for single apartments, renters, or individual tech hardware.',
      features: [
        'Pure Actuarial Cost Pass-Through (0% hidden margin)',
        '3-Question Frictionless Geo-Intake',
        'Standard 3-Second Computer Vision Claims',
        'Direct Open Banking FedNow Settlements',
        'Community Giveback Pool Participation',
      ],
      cta: 'Current Core Plan',
    },
    {
      id: 'PRO',
      name: 'Autonomous Resilience Pro',
      fee: '$9.00',
      period: 'flat software fee/mo',
      badge: 'Most Popular',
      popular: true,
      description: 'Full IoT risk-deflation telemetry, automated parametric oracle triggers, and AI agent endorsement dispatch.',
      features: [
        'All Essential Micro-Shield Features',
        'Real-time IoT Telemetry & 100% Loss Prevention Rebate',
        'Parametric Weather & Seismic Oracle Auto-Payouts',
        '24/7 Autonomous AI Agent Policy Endorsements',
        'P2P Social Risk Sub-Pool Creation & Dividends',
        'zk-SNARK Cryptographic Fraud Immunity',
      ],
      cta: 'Active Plan',
    },
    {
      id: 'ENTERPRISE',
      name: 'Syndicate & Multi-Property',
      fee: '$24.00',
      period: 'flat software fee/mo',
      badge: 'Institutional & HOA',
      description: 'For multi-home portfolios, EV fleets, commercial HOA communities, and custom captive risk pooling.',
      features: [
        'All Pro Resilience Features',
        'Multi-Property & Fleet Telematics Aggregation',
        'Custom Parametric Oracle Data Feed Integrations',
        'Dedicated Smart Contract Risk Reserve Vault',
        'Quarterly On-Chain Actuarial Audit Verification',
        'Priority FedNow Instant Payout Liquidity Buffer',
      ],
      cta: 'Upgrade to Syndicate',
    },
  ];

  const handleSelectTier = (id: string) => {
    setSelectedTier(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#10b981'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono mb-3">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              Monetization: Subscription Tiers & Surplus Model
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Transparent Flat Software Fees. Zero Actuarial Float Markup.
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              We charge a predictable, nominal flat software subscription fee to power the automated infrastructure. <strong>We take zero commission on risk</strong> and earn no profit by denying claims.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-amber-200">Operating Model</span>
            <div className="text-2xl font-bold text-amber-300 font-mono mt-0.5">SaaS Flat Fee</div>
            <p className="text-xs text-slate-300 mt-1">Zero Commission Friction</p>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isSelected = selectedTier === t.id;

          return (
            <div
              key={t.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all relative shadow-sm ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-800 text-white font-bold text-[10px] uppercase font-mono tracking-wider shadow-xs">
                  Recommended Architecture
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-teal-800 uppercase tracking-wider font-semibold">{t.badge}</span>
                  {isSelected && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                      CURRENT
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Cabinet_Grotesk']">{t.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">{t.fee}</span>
                    <span className="text-xs text-slate-500 font-mono">{t.period}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {t.description}
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <span className="text-[11px] font-mono uppercase text-slate-500 block font-medium">Features Included:</span>
                  {t.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-sans text-[11px]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                id={`btn-select-tier-${t.id.toLowerCase()}`}
                type="button"
                onClick={() => handleSelectTier(t.id)}
                className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {isSelected ? 'Selected Active Tier' : `Switch to ${t.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
