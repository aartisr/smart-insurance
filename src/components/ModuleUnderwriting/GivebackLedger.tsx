import React, { useState } from 'react';
import { 
  PieChart, 
  Heart, 
  Coins, 
  CheckCircle2, 
  TrendingDown, 
  Sparkles,
  Award
} from 'lucide-react';
import { GivebackLedgerEntry, UserPolicy } from '../../types';
import { GIVEBACK_LEDGER } from '../../data/mockData';

interface GivebackLedgerProps {
  policy: UserPolicy;
  onSelectCharity: (charity: string) => void;
}

export const GivebackLedger: React.FC<GivebackLedgerProps> = ({ policy, onSelectCharity }) => {
  const [ledgerEntries] = useState<GivebackLedgerEntry[]>(GIVEBACK_LEDGER);
  const [selectedCharity, setSelectedCharity] = useState(policy.selectedCharity || 'Direct Relief & Clean Water Initiative');
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const charities = [
    { name: 'Direct Relief & Clean Water Initiative', votes: '38.4%', impact: 'Emergency medical aid & purification nodes in wildfire/flood zones' },
    { name: 'Cascadia Habitat Resilience Fund', votes: '29.1%', impact: 'Firebreak creation & seismic structural retrofitting for low-income housing' },
    { name: 'Open Geospatial Weather Sensor Foundation', votes: '18.2%', impact: 'Deploying high-precision open Doppler sensors for free public alerts' },
    { name: 'Customer Direct Cash Rebate Wallet', votes: '14.3%', impact: '100% direct cash refund credited straight back to your bank account' },
  ];

  const handleVote = (name: string) => {
    setSelectedCharity(name);
    onSelectCharity(name);
    setVoteSubmitted(true);
    setTimeout(() => setVoteSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono mb-3">
              <PieChart className="w-3.5 h-3.5 text-amber-300" />
              Module 1: Flat-Fee Giveback Ledger
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Strict 20% Operating Fee & Zero Conflict-of-Interest
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Traditional insurers make higher profits whenever they delay or deny your claim. Aequitas operates on a strict <strong>fixed 20% operational fee</strong>. We never profit from claim denials. All remaining 80% unclaimed premium is returned as customer cash rebates or directed to community givebacks.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-amber-200">Fixed Operating Ratio</span>
            <div className="text-2xl font-bold text-amber-300 font-mono mt-0.5">Exact 20.00%</div>
            <p className="text-xs text-slate-300 mt-1">80% Protected Pool & Rebates</p>
          </div>
        </div>
      </div>

      {/* Visual Mathematical Distribution of Dollar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-base flex items-center justify-between font-['Cabinet_Grotesk']">
          <span>Where Every $1.00 of Premium Flows (Zero Hidden Margin)</span>
          <span className="text-xs font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">Publicly Audited</span>
        </h3>

        {/* Bar breakdown */}
        <div className="h-7 w-full rounded-xl bg-slate-100 flex overflow-hidden border border-slate-200 p-0.5 shadow-2xs">
          <div className="bg-amber-500 h-full w-[20%] rounded-l-lg flex items-center justify-center text-[11px] font-bold text-white font-mono" title="20% Fixed Operating">
            20% Ops
          </div>
          <div className="bg-teal-600 h-full w-[45%] flex items-center justify-center text-[11px] font-bold text-white font-mono" title="45% Paid Claims">
            45% Claims Paid Instant RTP
          </div>
          <div className="bg-emerald-600 h-full w-[35%] rounded-r-lg flex items-center justify-center text-[11px] font-bold text-white font-mono" title="35% Surplus Giveback/Rebate">
            35% Surplus Giveback & Rebates
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              20¢ Flat Operating Fee
            </div>
            <p className="text-slate-600 text-[11px] font-sans">
              Powers serverless infrastructure, verified oracles, and customer service AI agents. No multi-million dollar broker bonuses.
            </p>
          </div>

          <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200">
            <div className="flex items-center gap-2 text-teal-900 font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              45¢ Legitimate Claims Pool
            </div>
            <p className="text-slate-600 text-[11px] font-sans">
              Dedicated liquidity buffer guaranteeing 3-second FedNow/RTP payouts for covered fires, pipes, storm damage, and auto incidents.
            </p>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              35¢ Community Giveback & Rebate
            </div>
            <p className="text-slate-600 text-[11px] font-sans">
              All leftover funds are divided between community causes and direct cash refunds back to policyholders.
            </p>
          </div>
        </div>
      </div>

      {/* Giveback Voting & Choice Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Charity / Rebate Allocator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2 font-['Cabinet_Grotesk']">
                <Heart className="w-4 h-4 text-rose-500" />
                Vote Where Your Unclaimed Surplus Goes
              </h4>
              <span className="text-xs font-mono text-slate-500 font-medium">
                Quarterly Cycle
              </span>
            </div>

            <div className="space-y-3">
              {charities.map((c) => {
                const isSelected = selectedCharity === c.name;
                return (
                  <button
                    key={c.name}
                    id={`charity-option-${c.name.substring(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => handleVote(c.name)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-slate-900 shadow-xs ring-1 ring-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">{c.name}</span>
                      <span className="text-xs font-mono text-teal-700 font-bold">{c.votes} pool vote</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-normal font-sans">
                      {c.impact}
                    </p>
                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active Allocation for your policy ({policy.id})</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {voteSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Giveback allocation vote recorded on policy ledger!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Audited Quarterly Ledger Historical Records */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2 font-['Cabinet_Grotesk']">
                <Coins className="w-4 h-4 text-amber-600" />
                Audited Giveback Ledger (Transparent History)
              </h4>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                100% Audited
              </span>
            </div>

            <div className="space-y-3">
              {ledgerEntries.map((entry) => (
                <div key={entry.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-['Cabinet_Grotesk']">{entry.quarter}</span>
                    <span className="text-[10px] font-mono text-teal-800 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                      {entry.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">Total Inflow</span>
                      <span className="text-slate-900 font-bold">${(entry.totalPremiumsCollected / 1000000).toFixed(2)}M</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">20% Flat Ops</span>
                      <span className="text-amber-700 font-bold">${(entry.fixedOperatingFee20 / 1000000).toFixed(2)}M</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">Giveback Returned</span>
                      <span className="text-emerald-700 font-bold">${(entry.remainingSurplus80 / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
