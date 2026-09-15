import React, { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPolicy } from '../../types';

interface PaymentOrchestrationProps {
  policy: UserPolicy;
  onPaymentRailUpdated: (discount: number) => void;
}

export const PaymentOrchestration: React.FC<PaymentOrchestrationProps> = ({
  policy,
  onPaymentRailUpdated,
}) => {
  const [selectedRail, setSelectedRail] = useState<'OPEN_BANKING' | 'CREDIT_CARD'>('OPEN_BANKING');
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [bankLinked, setBankLinked] = useState(true);

  const handleSimulateBankConnect = () => {
    setIsLinkingBank(true);
    setTimeout(() => {
      setIsLinkingBank(false);
      setBankLinked(true);
      setSelectedRail('OPEN_BANKING');
      onPaymentRailUpdated(10.00);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#10b981'],
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-mono mb-3">
              <CreditCard className="w-3.5 h-3.5 text-teal-300" />
              Module 4: Payment Orchestration Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Bypassing 3% Credit Card Interchange Tolls
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Credit card networks charge 2.9% + 30¢ on every monthly insurance payment—funneling billions of consumer dollars to payment tollbooths. Aequitas routes directly through <strong>FedNow & Open Banking ACH Direct rails</strong> at zero interchange markup, returning 100% of the savings back into your surplus wallet.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-teal-200">Interchange Toll Cut</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">2.9% Saved</div>
            <p className="text-xs text-slate-300 mt-1">Returned to user Giveback</p>
          </div>
        </div>
      </div>

      {/* Payment Rails Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Open Banking Direct Rail */}
        <div className={`bg-white border rounded-2xl p-6 space-y-4 transition-all shadow-sm ${
          selectedRail === 'OPEN_BANKING'
            ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
            : 'border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm font-['Cabinet_Grotesk']">
                  Direct Open Banking (FedNow / ACH)
                </h4>
                <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                  Zero-Fee Direct Settlement Rail
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
              RECOMMENDED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block font-medium">Payment Interchange Toll</span>
              <span className="text-emerald-700 font-bold">$0.00 (0.0%)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block font-medium">Annual Direct Savings</span>
              <span className="text-emerald-700 font-bold">+$28.50 credited</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Direct tokenized bank-to-bank settlement. Instant payout clearing for claims within 3 seconds.
          </p>

          <button
            id="btn-connect-open-banking"
            type="button"
            disabled={isLinkingBank}
            onClick={handleSimulateBankConnect}
            className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isLinkingBank ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Open Banking Token...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{bankLinked ? 'Chase Premier Checking (Token Connected)' : 'Connect Bank via Open Banking'}</span>
              </>
            )}
          </button>
        </div>

        {/* Legacy Credit Card Rail */}
        <div className={`bg-white border rounded-2xl p-6 space-y-4 transition-all shadow-sm ${
          selectedRail === 'CREDIT_CARD'
            ? 'border-rose-400 shadow-md'
            : 'border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm font-['Cabinet_Grotesk']">
                  Traditional Credit Card Rail
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  Legacy Card Networks (Visa/Mastercard)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              HIGH INTERCHANGE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block font-medium">Payment Interchange Toll</span>
              <span className="text-rose-700 font-bold">2.9% + $0.30 per charge</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[10px] block font-medium">Annual Consumer Drag</span>
              <span className="text-rose-700 font-bold">-$34.20 lost to card tolls</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Card processors impose interchange tolls that inflate insurance premiums without providing risk protection.
          </p>

          <button
            id="btn-select-card-rail"
            type="button"
            onClick={() => setSelectedRail('CREDIT_CARD')}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-mono text-xs transition-colors cursor-pointer"
          >
            Switch to Credit Card (Adds 2.9% surcharge)
          </button>
        </div>
      </div>
    </div>
  );
};
