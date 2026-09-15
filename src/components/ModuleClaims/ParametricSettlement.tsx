import React, { useState } from 'react';
import { 
  Activity, 
  Radio, 
  CloudLightning, 
  Plane, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ParametricTrigger, ClaimRecord } from '../../types';
import { PARAMETRIC_TRIGGERS } from '../../data/mockData';

interface ParametricSettlementProps {
  onAutoClaimPaid: (claim: ClaimRecord) => void;
}

export const ParametricSettlement: React.FC<ParametricSettlementProps> = ({ onAutoClaimPaid }) => {
  const [triggers, setTriggers] = useState<ParametricTrigger[]>(PARAMETRIC_TRIGGERS);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [settledNotice, setSettledNotice] = useState<string | null>(null);

  const handleSimulateOracleTrigger = (trigger: ParametricTrigger) => {
    setSimulatingId(trigger.id);

    setTimeout(() => {
      // Mark trigger as fired
      setTriggers((prev) =>
        prev.map((t) =>
          t.id === trigger.id
            ? { ...t, isTriggered: true, currentLiveReading: 'THRESHOLD EXCEEDED: ORACLE CONFIRMED' }
            : t
        )
      );

      const notice = `⚡ PARAMETRIC AUTO-PAYOUT: ${trigger.title} objective threshold reached! $${trigger.autoPayoutAmount} transferred to bank in ${trigger.latencySeconds}s with ZERO paperwork.`;
      setSettledNotice(notice);
      setSimulatingId(null);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#0d9488', '#10b981', '#f59e0b'],
      });

      const autoClaim: ClaimRecord = {
        id: 'CLM-PARAM-' + Math.floor(1000 + Math.random() * 9000),
        category: `Parametric: ${trigger.hazardType}`,
        date: new Date().toISOString().split('T')[0],
        description: `Objective oracle trigger: ${trigger.oracleSource}. Automated parametric settlement executed without human claim filing.`,
        claimedAmount: trigger.autoPayoutAmount,
        payoutAmount: trigger.autoPayoutAmount,
        status: 'PARAMETRIC_AUTO_PAID',
        processingTimeSeconds: trigger.latencySeconds,
        fraudAnomalyScore: 0.2,
        damageSeverity: 'MODERATE',
        rtpTransferId: 'ORACLE-FEDNOW-' + Math.floor(100000 + Math.random() * 900000),
        cryptographicProofHash: '0x' + Math.random().toString(16).substring(2, 18),
      };

      onAutoClaimPaid(autoClaim);

      setTimeout(() => {
        setSettledNotice(null);
      }, 7000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-mono mb-3">
              <Radio className="w-3.5 h-3.5 text-teal-300" />
              Module 2: Parametric Auto-Settlement Oracles
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Objective Data Nodes & Zero-Paperwork Payouts
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              When a severe hail core, earthquake, or major airline cancellation hits, you should not have to fill out claim forms or wait for phone queues. Aequitas listens to objective 3rd-party oracle feeds (NOAA Doppler, USGS, FlightAware) and <strong>automatically deposits funds into your bank in seconds</strong>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-teal-200">Processing Overhead</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">0.00% Overhead</div>
            <p className="text-xs text-slate-300 mt-1">Zero claim forms or adjusters</p>
          </div>
        </div>
      </div>

      {/* Auto Settlement Banner Notice */}
      {settledNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <strong className="text-emerald-900 font-mono font-bold">AUTOMATED ORACLE SETTLEMENT:</strong> {settledNotice}
          </div>
        </div>
      )}

      {/* Oracle Trigger Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {triggers.map((trigger) => {
          const isFired = trigger.isTriggered;
          const isSimulating = simulatingId === trigger.id;

          return (
            <div
              key={trigger.id}
              className={`bg-white border rounded-2xl p-6 space-y-4 transition-all shadow-sm ${
                isFired
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    trigger.hazardType === 'SEISMIC'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : trigger.hazardType === 'SEVERE_HAIL'
                      ? 'bg-teal-50 border-teal-200 text-teal-700'
                      : trigger.hazardType === 'FLIGHT_DELAY'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    {trigger.hazardType === 'SEISMIC' && <Activity className="w-5 h-5" />}
                    {trigger.hazardType === 'SEVERE_HAIL' && <CloudLightning className="w-5 h-5" />}
                    {trigger.hazardType === 'FLIGHT_DELAY' && <Plane className="w-5 h-5" />}
                    {trigger.hazardType === 'POWER_GRID' && <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm font-['Cabinet_Grotesk']">
                      {trigger.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Oracle: {trigger.oracleSource}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-semibold ${
                  isFired
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {isFired ? 'AUTO-SETTLED' : 'MONITORING'}
                </span>
              </div>

              {/* Threshold & Live Readings */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Trigger Criterion</span>
                  <span className="text-slate-800 font-semibold text-[11px] block mt-0.5">
                    {trigger.triggerThreshold}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Live Oracle Datum</span>
                  <span className={`font-semibold text-[11px] block mt-0.5 ${
                    isFired ? 'text-emerald-700 font-bold' : 'text-slate-800'
                  }`}>
                    {trigger.currentLiveReading}
                  </span>
                </div>
              </div>

              {/* Payout Metric and Auto-Trigger Simulation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-medium block">
                    Automatic Instant Direct Deposit
                  </span>
                  <span className="text-lg font-bold text-emerald-700 font-mono">
                    ${trigger.autoPayoutAmount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                    (in {trigger.latencySeconds}s)
                  </span>
                </div>

                <button
                  id={`btn-simulate-oracle-${trigger.id}`}
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateOracleTrigger(trigger)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                      <span>Oracle Querying...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5 text-teal-700" />
                      <span>{isFired ? 'Re-Trigger Test Spike' : 'Simulate Oracle Trigger'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
