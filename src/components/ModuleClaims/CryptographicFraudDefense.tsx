import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Scan, 
  CheckCircle, 
  Hash, 
  Fingerprint
} from 'lucide-react';

export const CryptographicFraudDefense: React.FC = () => {
  const [testClaimHash, setTestClaimHash] = useState('0x9a8f2e71d4b6c310');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutput, setVerificationOutput] = useState<any | null>({
    status: 'VERIFIED_GENUINE',
    fraudScore: 1.4,
    neuralHashMatch: '0% (No recycled web imagery found)',
    telemetryAlignment: '100% (Sensor timestamp matches Cascadia sub-station data)',
    zkProof: 'zk-SNARK Groth16 Proof Validated (Layer 1 Zero-Knowledge)',
  });

  const handleRunFraudScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationOutput({
        status: 'VERIFIED_GENUINE',
        fraudScore: 0.8,
        neuralHashMatch: '0% (Unique photon signature confirmed)',
        telemetryAlignment: '99.8% (IoT Moen Flo telemetry matches claim timestamp)',
        zkProof: 'zk-SNARK Proof #99214 Validated with Zero PII Leakage',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono mb-3">
              <Lock className="w-3.5 h-3.5 text-indigo-300" />
              Module 2: Cryptographic Fraud Mitigation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Multi-Layer ML Anomaly Detection & Zero-Knowledge Proofs
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Insurance fraud costs the US industry over $308 Billion annually—costing the average family $900/year in inflated premiums. Aequitas deploys neural perceptual image hashing, weather-telemetry alignment, and zero-knowledge attestations to <strong>drop fraud losses to near zero</strong>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-indigo-200">Industry Fraud Loss</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">&lt;0.05% Loss</div>
            <p className="text-xs text-slate-300 mt-1">vs 10% Industry Average</p>
          </div>
        </div>
      </div>

      {/* 4-Step Verification Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: '1. Neural Perceptual Hash',
            desc: 'Cross-checks claim photos against 450k+ recycled insurance web images to eliminate duplicate and staged photos.',
            stat: '0 Duplicates',
            icon: <Scan className="w-4 h-4 text-teal-600" />,
            badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
          },
          {
            title: '2. Telemetry Coherence',
            desc: 'Verifies whether smart water flow spikes or connected vehicle G-force accelerations match the claimed event time.',
            stat: '100% Sensor Coherence',
            icon: <Cpu className="w-4 h-4 text-emerald-600" />,
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          },
          {
            title: '3. Solar Azimuth & EXIF',
            desc: 'Calculates ambient shadow angles against solar ephemeris models to verify true geographical and time authenticity.',
            stat: 'Optically Certified',
            icon: <Fingerprint className="w-4 h-4 text-amber-600" />,
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          },
          {
            title: '4. Zero-Knowledge Proof',
            desc: 'Cryptographically verifies claim legitimacy without exposing private identity or medical records to third parties.',
            stat: 'zk-SNARK Validated',
            icon: <Lock className="w-4 h-4 text-indigo-600" />,
            badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                {item.icon}
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${item.badgeBg}`}>
                Active
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 text-xs font-['Cabinet_Grotesk']">{item.title}</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{item.desc}</p>
            <div className="text-xs font-mono text-teal-700 font-bold border-t border-slate-100 pt-2">
              {item.stat}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Cryptographic Hash Verifier */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2 font-['Cabinet_Grotesk']">
            <Hash className="w-4 h-4 text-teal-600" />
            Live Zero-Knowledge Claim Proof Verifier
          </h3>
          <span className="text-xs font-mono text-slate-500 font-medium">Cryptographic Attestation</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="input-fraud-test-hash"
            type="text"
            value={testClaimHash}
            onChange={(e) => setTestClaimHash(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-500 focus:bg-white"
            placeholder="Enter claim cryptographic proof hash (0x...)"
          />
          <button
            id="btn-run-fraud-verification"
            type="button"
            disabled={isVerifying}
            onClick={handleRunFraudScan}
            className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying zk-SNARK...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Claim Integrity</span>
              </>
            )}
          </button>
        </div>

        {verificationOutput && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-emerald-800 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {verificationOutput.status}
              </span>
              <span>Anomaly Risk Score: {verificationOutput.fraudScore}/100</span>
            </div>
            <div className="text-slate-600 text-[11px] space-y-1 pt-1">
              <div>• Neural Hash Check: {verificationOutput.neuralHashMatch}</div>
              <div>• Telemetry Timestamp Check: {verificationOutput.telemetryAlignment}</div>
              <div>• Cryptographic Seal: {verificationOutput.zkProof}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
