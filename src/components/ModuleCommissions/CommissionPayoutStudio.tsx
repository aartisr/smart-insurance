import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Send,
  Sliders,
  TrendingUp,
  Activity,
  CreditCard,
  Lock,
  Clock,
  Car,
  Home,
  Check
} from 'lucide-react';
import { CarrierConnectorStatus, CommissionRecord, InstantPayoutExecution } from '../../types';

interface CommissionPayoutStudioProps {
  onNotify?: (msg: string) => void;
}

export const CommissionPayoutStudio: React.FC<CommissionPayoutStudioProps> = () => {
  const [connectors, setConnectors] = useState<CarrierConnectorStatus[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(485.60);
  const [totalEarnedAllTime, setTotalEarnedAllTime] = useState<number>(662.38);
  const [totalPaidOut, setTotalPaidOut] = useState<number>(176.78);
  const [history, setHistory] = useState<CommissionRecord[]>([]);
  const [payouts, setPayouts] = useState<InstantPayoutExecution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cashout Modal State
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState<boolean>(false);
  const [cashoutAmount, setCashoutAmount] = useState<number>(availableBalance);
  const [selectedRail, setSelectedRail] = useState<'FEDNOW_RTP' | 'STRIPE_INSTANT' | 'VISA_DIRECT'>('FEDNOW_RTP');
  const [isProcessingCashout, setIsProcessingCashout] = useState<boolean>(false);
  const [cashoutSuccessReceipt, setCashoutSuccessReceipt] = useState<InstantPayoutExecution | null>(null);

  // Auto-Sweep State
  const [autoSweepEnabled, setAutoSweepEnabled] = useState<boolean>(true);

  // Simulation Bind State
  const [isSimulatingBind, setIsSimulatingBind] = useState<boolean>(false);
  const [simCarrier, setSimCarrier] = useState<string>('boost_insurance');
  const [simLine, setSimLine] = useState<'Auto' | 'Home' | 'Renters'>('Auto');
  const [simPremium, setSimPremium] = useState<number>(75.00);

  // Fetch initial ledger and connectors
  const fetchData = async () => {
    try {
      setLoading(true);
      const [connRes, commRes] = await Promise.all([
        fetch('/api/carriers/connectors'),
        fetch('/api/commissions/ledger')
      ]);

      if (connRes.ok) {
        const connData = await connRes.json();
        setConnectors(connData.connectors || []);
      }

      if (commRes.ok) {
        const commData = await commRes.json();
        setAvailableBalance(commData.availableBalance);
        setTotalEarnedAllTime(commData.totalEarnedAllTime);
        setTotalPaidOut(commData.totalPaidOut);
        setHistory(commData.history || []);
        setPayouts(commData.payouts || []);
        setCashoutAmount(commData.availableBalance);
      }
    } catch (err) {
      console.error('Error loading commissions data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Trigger External Carrier Bind (generates instant commission)
  const handleSimulateBind = async () => {
    try {
      setIsSimulatingBind(true);
      const res = await fetch('/api/carriers/bind-external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrierId: simCarrier,
          customerName: 'Direct API Lead #' + Math.floor(100 + Math.random() * 900),
          insuranceLine: simLine,
          grossPremium: simPremium,
          commissionRate: simCarrier === 'sure_app' ? 22 : simCarrier === 'boost_insurance' ? 18 : 15
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAvailableBalance(data.currentAvailableBalance);
        setTotalEarnedAllTime((prev) => +(prev + data.commissionRecord.commissionAmount).toFixed(2));
        setHistory((prev) => [data.commissionRecord, ...prev]);
        setCashoutAmount(data.currentAvailableBalance);
      }
    } catch (err) {
      console.error('Error binding policy:', err);
    } finally {
      setIsSimulatingBind(false);
    }
  };

  // Trigger Instant Cash-Out
  const handleExecuteCashout = async () => {
    if (cashoutAmount <= 0 || cashoutAmount > availableBalance) return;
    try {
      setIsProcessingCashout(true);
      const res = await fetch('/api/commissions/instant-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cashoutAmount,
          rail: selectedRail,
          destination: 'Chase Treasury Business Account (•••• 8412)'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCashoutSuccessReceipt(data.payout);
        setAvailableBalance(data.remainingBalance);
        setTotalPaidOut((prev) => +(prev + data.payout.amount).toFixed(2));
        setPayouts((prev) => [data.payout, ...prev]);
        setHistory((prev) =>
          prev.map((c) => ({
            ...c,
            payoutStatus: 'PAID_OUT_INSTANT',
            payoutMethod: selectedRail,
            payoutTxHash: data.payout.txHash
          }))
        );
      }
    } catch (err) {
      console.error('Error executing payout:', err);
    } finally {
      setIsProcessingCashout(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero / Real-Time Commission Vault Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-teal-400 fill-teal-400" />
                REAL-TIME COMMISSION DISBURSEMENT ENGINE
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                FedNow / Visa Direct &lt; 3.0s
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cabinet_Grotesk'] tracking-tight">
              Real Provider Integrations & Instant Payouts
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Eliminate the traditional 60-day broker commission delay. Bind policies programmatically through certified embedded carrier APIs (<span className="text-teal-300 font-semibold">Boost, Sure, EZLynx</span>) and disburse <span className="text-emerald-300 font-semibold">15%–22% agency commissions</span> straight to your bank account in seconds.
            </p>
          </div>

          {/* Instant Cashout Primary Vault Card */}
          <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between min-w-[280px] sm:min-w-[320px] shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                Available to Cash Out
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Instant Ready
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black font-['Cabinet_Grotesk'] text-white tracking-tight mb-4 flex items-baseline gap-1">
              <span className="text-teal-400">$</span>
              {availableBalance.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 font-mono ml-1">USD</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                id="btn-trigger-instant-cashout"
                onClick={() => {
                  setCashoutAmount(availableBalance);
                  setCashoutSuccessReceipt(null);
                  setIsCashoutModalOpen(true);
                }}
                disabled={availableBalance <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer min-h-[42px]"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Cash Out to Bank Instantly (&lt;3s)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  FedNow Direct Rail
                </span>
                <button
                  type="button"
                  onClick={() => setAutoSweepEnabled(!autoSweepEnabled)}
                  className="text-slate-300 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Auto-Sweep:</span>
                  <span className={autoSweepEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {autoSweepEnabled ? 'ON (>$100)' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lifetime Revenue Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[11px]">Total Commission Earned</div>
            <div className="text-base font-bold text-white mt-0.5">${totalEarnedAllTime.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Total Instant Cash-Outs</div>
            <div className="text-base font-bold text-teal-300 mt-0.5">${totalPaidOut.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Avg Settlement Latency</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">1.4 seconds</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Connected Carrier APIs</div>
            <div className="text-base font-bold text-sky-400 mt-0.5">6 Active Protocols</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: LIVE CARRIER CONNECTORS GATEWAY */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">
                Live Carrier Connectors & Rating Aggregators
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active programmatic APIs enabling sub-30-second automated underwriting, instant policy issuance, and real-time revenue splits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ping Status</span>
            </button>
          </div>
        </div>

        {/* Carrier Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.map((conn) => (
            <div
              key={conn.id}
              className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                    {conn.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {conn.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm font-['Cabinet_Grotesk'] flex items-center justify-between">
                  <span>{conn.name}</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">{conn.latencyMs}ms</span>
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                  Lines: {conn.supportedLines.join(', ')}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Commission Share:</span>
                  <span className="font-bold text-teal-700">
                    {conn.commissionSharePercent > 0 ? `${conn.commissionSharePercent}% gross` : 'Telematics Hub'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono mt-1">
                  <span className="text-slate-500">Disbursement:</span>
                  <span className="font-semibold text-slate-900">{conn.payoutTime}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <a
                  href={conn.apiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-teal-700 hover:text-teal-900 flex items-center gap-1 font-semibold"
                >
                  <span>API Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Live Bind Simulator (Test Instant Commissions) */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/90 rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <h4 className="text-sm font-bold text-slate-900 font-['Cabinet_Grotesk']">
                  Interactive Carrier Bind & Instant Commission Simulator
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Trigger a simulated programmatic policy bind across an active carrier API to observe the instant 80/20 revenue split and real-time commission credit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <select
                value={simCarrier}
                onChange={(e) => setSimCarrier(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
              >
                <option value="boost_insurance">Boost Insurance API (18% Comm)</option>
                <option value="sure_app">Sure Embedded Platform (22% Comm)</option>
                <option value="ezlynx_rating">EZLynx / Progressive (15% Comm)</option>
              </select>

              <select
                value={simLine}
                onChange={(e) => setSimLine(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
              >
                <option value="Auto">Auto ($75/mo)</option>
                <option value="Home">Home ($120/mo)</option>
                <option value="Renters">Renters ($28/mo)</option>
              </select>

              <button
                type="button"
                id="btn-simulate-carrier-bind"
                onClick={handleSimulateBind}
                disabled={isSimulatingBind}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap min-h-[38px]"
              >
                {isSimulatingBind ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Bind Policy &amp; Credit Commission</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE COMMISSION LEDGER & SPLIT ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Commission Transaction Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Cabinet_Grotesk'] flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>Live Commission Ledger &amp; Payout Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every policy bound triggers an atomic revenue split and instant ledger credit.
              </p>
            </div>

            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
              {history.length} Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 pr-3">Tx ID / Time</th>
                  <th className="py-2.5 px-3">Carrier / Line</th>
                  <th className="py-2.5 px-3">Gross Premium</th>
                  <th className="py-2.5 px-3">Agency Comm.</th>
                  <th className="py-2.5 px-3">Underwriting Pool</th>
                  <th className="py-2.5 pl-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 pr-3 font-semibold text-slate-900">
                      <div>{record.id}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{record.carrierName}</div>
                      <div className="text-[10px] text-slate-500">{record.insuranceLine} • {record.customerName}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      ${record.grossPremium.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      +${record.commissionAmount.toFixed(2)}
                      <span className="text-[10px] text-slate-400 font-normal block">({record.commissionRatePercent}%)</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      ${record.carrierUnderwritingPoolShare.toFixed(2)}
                    </td>
                    <td className="py-3 pl-3">
                      {record.payoutStatus === 'PAID_OUT_INSTANT' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          PAID INSTANT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-teal-600" />
                          AVAILABLE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Real-Time Split Breakdown Architecture & Payout History */}
        <div className="space-y-6">
          {/* Revenue Split Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-['Cabinet_Grotesk'] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <span>Programmatic Split Architecture</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Carrier Risk Pool (Underwriting):</span>
                  <span className="font-bold text-slate-900">80.0%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-800 w-[80%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Your Agency Commission:</span>
                  <span className="font-bold">18.0% (Instant)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[18%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-teal-700">
                  <span>Community Surplus / Giveback:</span>
                  <span className="font-bold text-slate-900">2.0%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-400 w-[2%]"></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-mono">
              ⚡ All splits are calculated atomically in the same block as customer payment verification, preventing any lockup of broker earnings.
            </div>
          </div>

          {/* Recent Payout Dispatches */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-['Cabinet_Grotesk'] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Recent Instant Bank Payouts</span>
            </h3>

            {payouts.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">No payouts executed yet.</p>
            ) : (
              <div className="space-y-2.5 font-mono text-xs">
                {payouts.map((p) => (
                  <div key={p.payoutId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">${p.amount.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        {p.settlementSpeed}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{p.destinationAccount}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.txHash}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: INSTANT CASHOUT EXECUTION */}
      {isCashoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            {!cashoutSuccessReceipt ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5 fill-teal-800" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-['Cabinet_Grotesk']">
                        Instant Commission Cash-Out
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Disburse available funds in &lt; 3.0 seconds
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCashoutModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold font-mono px-2 py-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-700 font-semibold flex justify-between">
                    <span>Withdrawal Amount (USD)</span>
                    <span className="text-teal-700">Max: ${availableBalance.toFixed(2)}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base font-mono">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={availableBalance}
                      value={cashoutAmount}
                      onChange={(e) => setCashoutAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Payout Rail Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-700 font-semibold">
                    Select Real-Time Payout Rail
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRail('FEDNOW_RTP')}
                      className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                        selectedRail === 'FEDNOW_RTP'
                          ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">FedNow / RTP</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">&lt; 1.5s • $0 Fee</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRail('STRIPE_INSTANT')}
                      className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                        selectedRail === 'STRIPE_INSTANT'
                          ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">Stripe Connect</div>
                      <div className="text-[10px] text-slate-500">&lt; 3.0s • 0.5% Fee</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRail('VISA_DIRECT')}
                      className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                        selectedRail === 'VISA_DIRECT'
                          ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">Visa Direct</div>
                      <div className="text-[10px] text-slate-500">&lt; 10s • Debit Card</div>
                    </button>
                  </div>
                </div>

                {/* Destination Account Preview */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Destination:</span>
                    <span className="font-semibold text-slate-900">Chase Commercial Checking (•••• 8412)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Transfer Speed:</span>
                    <span className="font-semibold text-emerald-700">Immediate Settlement</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Protocol Fee:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedRail === 'FEDNOW_RTP' ? '$0.00 (Zero-Margin)' : `$${(cashoutAmount * 0.005).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCashoutModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-mono font-semibold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-instant-payout"
                    onClick={handleExecuteCashout}
                    disabled={isProcessingCashout || cashoutAmount <= 0 || cashoutAmount > availableBalance}
                    className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isProcessingCashout ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>Authorize &amp; Transfer ${cashoutAmount.toFixed(2)}</span>
                  </button>
                </div>
              </>
            ) : (
              /* Success Receipt */
              <div className="space-y-6 text-center py-2 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black font-['Cabinet_Grotesk'] text-slate-900">
                    Instant Payout Dispatched!
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Funds have settled via {cashoutSuccessReceipt.rail} in {cashoutSuccessReceipt.settlementSpeed}.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs font-mono space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Disbursed Amount:</span>
                    <span className="font-bold text-slate-900">${cashoutSuccessReceipt.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="font-semibold text-slate-800">{cashoutSuccessReceipt.destinationAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Settlement Speed:</span>
                    <span className="font-bold text-emerald-700">{cashoutSuccessReceipt.settlementSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">RTP Reference Hash:</span>
                    <span className="font-mono text-[10px] text-slate-600 truncate max-w-[180px]">
                      {cashoutSuccessReceipt.txHash}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCashoutModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
