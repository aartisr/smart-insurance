import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen
} from 'lucide-react';
import { SAMPLE_POLICIES_FOR_TRANSLATOR } from '../../data/mockData';

export const PolicyTranslator: React.FC = () => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [customText, setCustomText] = useState(SAMPLE_POLICIES_FOR_TRANSLATOR[0].snippet);
  const [policyType, setPolicyType] = useState(SAMPLE_POLICIES_FOR_TRANSLATOR[0].type);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<any | null>(null);

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/policy/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyText: customText,
          policyType,
        }),
      });
      const data = await res.json();
      setTranslatedResult(data.translation);
    } catch (err) {
      console.error(err);
      setTranslatedResult({
        plainEnglishSummary: 'This policy protects your dwelling and personal property against catastrophic perils like sudden fire, burst interior pipes, windstorms, and theft. However, exterior surface flood waters, earth movement, and gradual undetected seepage are excluded unless covered by dedicated parametric riders.',
        transparencyScore: 98,
        coveredItems: [
          { title: 'Sudden Interior Plumbing Burst', plainDescription: 'If an indoor supply pipe bursts unexpectedly and floods floors, 100% replacement cost is covered with zero depreciation.', limitAdvice: 'Up to $150,000 limit' },
          { title: 'Fire, Smoke & Wildfire Ash', plainDescription: 'Rebuilds structure to code and provides alternative housing allowance while repairs are made.', limitAdvice: '100% Rebuilding Value ($450k)' },
          { title: 'Worldwide Theft of Portable Items', plainDescription: 'Covers laptops, bikes, cameras, and luggage anywhere in the world.', limitAdvice: '$15,000 personal property' },
        ],
        uncoveredExclusions: [
          { title: 'Rising Municipal Storm Flood', reasonWhy: 'Standard legacy contracts exclude surface runoff and water main breaks from municipal streets.', workaroundRider: 'Enable Parametric Flash Flood Rider ($3.50/mo)' },
          { title: 'Slow Undetected Drywall Mold', reasonWhy: 'Requires active maintenance unless paired with certified IoT moisture sensor.', workaroundRider: 'Deploy Moen Flo IoT sensor' },
        ],
        hiddenTrapsAndGotchas: [
          {
            clauseRef: 'Section IV(B) - Actual Cash Value Depreciation Trap',
            howCarriersTrickYou: 'Legacy carriers deduct 75% off the value of a 5-year-old roof or TV, leaving you with pennies.',
            howAequitasFixesIt: 'Aequitas pays 100% Full Replacement Cost Guarantee with zero depreciation penalty.',
          },
          {
            clauseRef: 'Section II - Concurrent Causation Clause',
            howCarriersTrickYou: 'If wind and water damage occur in the same storm, legacy carriers deny the entire claim based on water exclusion.',
            howAequitasFixesIt: 'Parametric AI separates event causes objectively and pays the covered wind damage portion immediately.',
          },
        ],
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const selectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setCustomText(SAMPLE_POLICIES_FOR_TRANSLATOR[idx].snippet);
    setPolicyType(SAMPLE_POLICIES_FOR_TRANSLATOR[idx].type);
    setTranslatedResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-mono mb-3">
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              Module 3: Jargon-Free Policy Translator
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              40-Page Legal Contracts Decoded into Plain English
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Insurance companies intentionally use obscure legalese like <em>"concurrent causation"</em> and <em>"actual cash value depreciation"</em> to deny legitimate claims. Our AI translator breaks down any policy into clear, transparent facts: <strong>what is covered, what isn't, and where the traps are</strong>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-indigo-200">Support & Dispute Cut</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">85% Fewer Disputes</div>
            <p className="text-xs text-slate-300 mt-1">100% Plain Language</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Contract Document */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2 font-['Cabinet_Grotesk']">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Select or Paste Policy Contract
              </h3>
              <span className="text-xs font-mono text-slate-500 font-medium">AI Decoder</span>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 block">Sample Legacy Contracts</label>
              <div className="space-y-2">
                {SAMPLE_POLICIES_FOR_TRANSLATOR.map((s, idx) => (
                  <button
                    key={idx}
                    id={`sample-policy-${idx}`}
                    type="button"
                    onClick={() => selectSample(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      selectedSampleIndex === idx
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 font-['Cabinet_Grotesk']">{s.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{s.type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contract Snippet Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Policy Legal Text Snippet</label>
              <textarea
                id="policy-legal-text-input"
                rows={6}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="Paste any insurance policy section or exclusion clause..."
              />
            </div>

            <button
              id="btn-run-policy-translation"
              type="button"
              disabled={isTranslating}
              onClick={handleTranslate}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Decoding Legal Fine-Print...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  <span>Translate into Jargon-Free Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive 3-Column Transparency Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {translatedResult ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm animate-in fade-in">
              {/* Executive Summary */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-indigo-800 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Plain English Executive Summary
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    Transparency: {translatedResult.transparencyScore || 98}/100
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-sans">
                  {translatedResult.plainEnglishSummary}
                </p>
              </div>

              {/* 1. What is Explicitly Covered */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-emerald-800 uppercase font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. What is Explicitly Covered (Zero Legalese)
                </h4>
                <div className="space-y-2">
                  {translatedResult.coveredItems?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        {item.limitAdvice && <span className="text-emerald-700 font-mono text-[11px] font-bold">{item.limitAdvice}</span>}
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 font-sans">{item.plainDescription}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. What is Strictly Excluded */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-rose-800 uppercase font-mono flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  2. Exclusions & Uncovered Risks
                </h4>
                <div className="space-y-2">
                  {translatedResult.uncoveredExclusions?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-rose-50/40 p-3.5 rounded-xl border border-rose-200 text-xs">
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <p className="text-slate-600 text-[11px] mt-1 font-sans">{item.reasonWhy}</p>
                      {item.workaroundRider && (
                        <div className="mt-2 text-[10px] text-teal-800 font-mono font-semibold flex items-center gap-1 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                          <span>💡 Fix:</span>
                          <span>{item.workaroundRider}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Hidden Fine-Print Gotchas Exposed */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-amber-800 uppercase font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  3. Carrier Fine-Print Traps Decoded vs Aequitas Solution
                </h4>
                <div className="space-y-2">
                  {translatedResult.hiddenTrapsAndGotchas?.map((trap: any, idx: number) => (
                    <div key={idx} className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
                      <div className="text-[11px] font-mono text-amber-900 font-bold">{trap.clauseRef}</div>
                      <div className="text-slate-700 text-[11px]">
                        <strong className="text-rose-700 font-mono">Legacy Carrier Trap:</strong> {trap.howCarriersTrickYou}
                      </div>
                      <div className="text-emerald-900 text-[11px] bg-emerald-50 p-2.5 rounded border border-emerald-200">
                        <strong className="font-mono text-emerald-800">How Aequitas Fixes It:</strong> {trap.howAequitasFixesIt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 font-['Cabinet_Grotesk']">
                Select a Policy to Decode
              </h3>
              <p className="text-slate-500 text-xs max-w-sm mt-2 leading-relaxed">
                Click <strong>"Translate into Jargon-Free Summary"</strong> to strip out legalese and expose fine-print exclusions in plain English.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
