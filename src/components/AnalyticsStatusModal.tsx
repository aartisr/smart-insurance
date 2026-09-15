import React, { useState, useEffect } from 'react';
import { Activity, Eye, BarChart3, CheckCircle2, ShieldCheck, RefreshCw, X, Zap } from 'lucide-react';
import { analytics } from '../lib/analytics';

interface AnalyticsStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsStatusModal: React.FC<AnalyticsStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState(analytics.isConfigured());
  const [testSent, setTestSent] = useState(false);
  const [clarityKeyInput, setClarityKeyInput] = useState(
    (import.meta.env.VITE_CLARITY_PROJECT_ID as string) || ''
  );
  const [posthogKeyInput, setPosthogKeyInput] = useState(
    (import.meta.env.VITE_POSTHOG_KEY as string) || ''
  );
  const [posthogHostInput, setPosthogHostInput] = useState(
    (import.meta.env.VITE_POSTHOG_HOST as string) || 'https://us.i.posthog.com'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(analytics.isConfigured());
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendTestEvents = () => {
    analytics.trackEvent('test_diagnostic_ping', {
      source: 'AnalyticsStatusModal',
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleApplyKeys = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.configure({
      clarityId: clarityKeyInput.trim() || undefined,
      posthogKey: posthogKeyInput.trim() || undefined,
      posthogHost: posthogHostInput.trim() || undefined,
    });
    setStatus(analytics.isConfigured());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Telemetry &amp; Behavioral Diagnostics
              </h3>
              <p className="text-xs font-mono text-slate-500">
                PostHog Product Analytics &amp; Microsoft Clarity Heatmaps
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PostHog Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-xs text-slate-800">PostHog</span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  status.posthog || status.posthogKeyConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status.posthog ? 'Live Connected' : status.posthogKeyConfigured ? 'Initialized' : 'Ready / Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Captures full-funnel quote submissions, binds, and commission cashout events.
            </p>
          </div>

          {/* Clarity Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-800">MS Clarity</span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  status.clarity || status.clarityKeyConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status.clarity ? 'Live Recording' : status.clarityKeyConfigured ? 'Initialized' : 'Ready / Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Provides user session recordings, scroll depth heatmaps, and rage-click detection.
            </p>
          </div>
        </div>

        {/* Live Diagnostics Action */}
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-teal-700" />
              <span>Broadcast Test Telemetry Event</span>
            </div>
            <p className="text-[11px] text-teal-800">
              Dispatches an enriched diagnostic payload to PostHog and Clarity tag pipelines.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSendTestEvents}
            className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-mono text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
          >
            {testSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dispatched!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ping Rails</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Project ID Form */}
        <form onSubmit={handleApplyKeys} className="space-y-3 pt-1">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Environment &amp; Project Identifiers
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">
                Microsoft Clarity Project ID:
              </label>
              <input
                type="text"
                placeholder="e.g. m8v3x9q2 (or leave default)"
                value={clarityKeyInput}
                onChange={(e) => setClarityKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">
                PostHog Project API Key:
              </label>
              <input
                type="text"
                placeholder="phc_... (or leave default)"
                value={posthogKeyInput}
                onChange={(e) => setPosthogKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-400 font-mono">
              Keys also persist across `.env` files and Vercel variables
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all shadow-xs"
            >
              {saveSuccess ? '✓ Saved & Re-initialized' : 'Save & Initialize'}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            GDPR &amp; CCPA Anonymized
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-teal-700 font-bold hover:underline"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
