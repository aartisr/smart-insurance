/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Zap, 
  Lock, 
  Sliders, 
  FileText, 
  Users, 
  Bot, 
  CreditCard, 
  Coins, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  PieChart,
  Radio,
  DollarSign,
  Scale
} from 'lucide-react';

import { Header } from './components/Header';
import { ZeroFrictionQuote } from './components/ModuleUnderwriting/ZeroFrictionQuote';
import { IoTTelemetryEngine } from './components/ModuleUnderwriting/IoTTelemetryEngine';
import { GivebackLedger } from './components/ModuleUnderwriting/GivebackLedger';

import { InstantClaimsTriage } from './components/ModuleClaims/InstantClaimsTriage';
import { ParametricSettlement } from './components/ModuleClaims/ParametricSettlement';
import { CryptographicFraudDefense } from './components/ModuleClaims/CryptographicFraudDefense';

import { CoverageSlider } from './components/ModuleTransparency/CoverageSlider';
import { PolicyTranslator } from './components/ModuleTransparency/PolicyTranslator';
import { P2PRiskPooling } from './components/ModuleTransparency/P2PRiskPooling';
import { ValueAddFeaturesStudio } from './components/ModuleTransparency/ValueAddFeaturesStudio';

import { AgenticCustomerService } from './components/ModuleTechStack/AgenticCustomerService';
import { PaymentOrchestration } from './components/ModuleTechStack/PaymentOrchestration';
import { MonetizationTiers } from './components/ModuleTechStack/MonetizationTiers';
import { ComparativePricingEngine } from './components/ModuleComparator/ComparativePricingEngine';
import { ExpressFastTrackModal } from './components/ExpressWorkflow/ExpressFastTrackModal';
import { ExpressQuickBar } from './components/ExpressWorkflow/ExpressQuickBar';

import { INITIAL_POLICY, INITIAL_CLAIMS, INITIAL_IOT_DEVICES } from './data/mockData';
import { UserPolicy, ClaimRecord, IoTDeviceStream, CarrierQuote, UserAffordabilityProfile } from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<'underwriting' | 'claims' | 'transparency' | 'cost_elimination' | 'comparator'>('comparator');
  const [activeSubTab, setActiveSubTab] = useState<string>('compare_rates');
  
  // Express Fast-Track Modal State
  const [isExpressModalOpen, setIsExpressModalOpen] = useState<boolean>(false);
  const [expressModalMode, setExpressModalMode] = useState<'instant_bind' | 'instant_claim' | 'rate_match'>('instant_bind');

  const [policy, setPolicy] = useState<UserPolicy>(INITIAL_POLICY);
  const [claimsHistory, setClaimsHistory] = useState<ClaimRecord[]>(INITIAL_CLAIMS);
  const [devices, setDevices] = useState<IoTDeviceStream[]>(INITIAL_IOT_DEVICES);

  // Policy update handler
  const handleUpdatePolicy = (updated: Partial<UserPolicy>) => {
    setPolicy((prev) => ({ ...prev, ...updated }));
  };

  // Open Express Fast Track Modal in specific mode
  const handleOpenExpressModal = (mode: 'instant_bind' | 'instant_claim' | 'rate_match') => {
    setExpressModalMode(mode);
    setIsExpressModalOpen(true);
  };

  // 1-Click Fast Preset Application across the entire policy
  const handleApplyPreset = (presetName: 'optimal' | 'budget' | 'fortress') => {
    if (presetName === 'optimal') {
      setPolicy((prev) => ({
        ...prev,
        activeMonthlyPremium: 43.60,
        baseMonthlyPremium: 78.00,
        deductible: 1000,
        valueAddFeatures: {
          rcvEnabled: true,
          extendedRebuildingPercent: 25,
          deductibleWaiverActive: true,
          autoRestoreBenefits: true,
          umbrellaCompatibilityLimit: 1000000,
          uninsuredMotoristEndorsement: true,
          noRoomRentCapping: true,
          inflationGuardPercent: 5,
          directVendorBilling247: true,
          multiPolicyLoyaltyBundling: true,
        },
      }));
    } else if (presetName === 'budget') {
      setPolicy((prev) => ({
        ...prev,
        activeMonthlyPremium: 29.80,
        baseMonthlyPremium: 65.00,
        deductible: 2000,
        valueAddFeatures: {
          rcvEnabled: true,
          extendedRebuildingPercent: 10,
          deductibleWaiverActive: false,
          autoRestoreBenefits: true,
          umbrellaCompatibilityLimit: 500000,
          uninsuredMotoristEndorsement: true,
          noRoomRentCapping: true,
          inflationGuardPercent: 3,
          directVendorBilling247: true,
          multiPolicyLoyaltyBundling: true,
        },
      }));
    } else if (presetName === 'fortress') {
      setPolicy((prev) => ({
        ...prev,
        activeMonthlyPremium: 62.40,
        baseMonthlyPremium: 110.00,
        deductible: 500,
        dwellingLimit: 750000,
        valueAddFeatures: {
          rcvEnabled: true,
          extendedRebuildingPercent: 50,
          deductibleWaiverActive: true,
          autoRestoreBenefits: true,
          umbrellaCompatibilityLimit: 2000000,
          uninsuredMotoristEndorsement: true,
          noRoomRentCapping: true,
          inflationGuardPercent: 8,
          directVendorBilling247: true,
          multiPolicyLoyaltyBundling: true,
        },
      }));
    }
  };

  // Bind quote from comparative pricing engine
  const handleBindCheapestRate = (carrier: CarrierQuote, profile: UserAffordabilityProfile) => {
    setPolicy((prev) => ({
      ...prev,
      assetType: profile.insuranceType as any,
      activeMonthlyPremium: carrier.netMonthlyRate,
      deductible: profile.maxDeductible,
      status: 'BOUND',
    }));
  };

  // Telemetry trigger handler
  const handleTriggerTelemetry = (deviceId: string, eventName: string, additionalDiscount: number) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const newSavings = d.monthlySavings + additionalDiscount;
          const newLog = {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            event: eventName,
            safetyScore: Math.min(100, (d.telemetryLogs[0]?.safetyScore || 95) + 1),
          };
          return {
            ...d,
            monthlySavings: newSavings,
            telemetryLogs: [newLog, ...d.telemetryLogs],
          };
        }
        return d;
      })
    );

    setPolicy((prev) => ({
      ...prev,
      iotDiscountMonthly: prev.iotDiscountMonthly + additionalDiscount,
      activeMonthlyPremium: Math.max(18, prev.activeMonthlyPremium - additionalDiscount),
      givebackSurplusAccrued: prev.givebackSurplusAccrued + additionalDiscount * 2,
    }));
  };

  // Toggle IoT device online/offline
  const handleToggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const nextStatus = d.status === 'ONLINE' || d.status === 'ACTIVE_PREVENTION' ? 'SYNCING' : 'ONLINE';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  // Claim settlement handler
  const handleClaimSettled = (newClaim: ClaimRecord) => {
    setClaimsHistory((prev) => [newClaim, ...prev]);
    // Also increase total giveback pool claim metrics slightly
    setPolicy((prev) => ({
      ...prev,
      givebackSurplusAccrued: Math.max(50, prev.givebackSurplusAccrued - newClaim.payoutAmount * 0.1),
    }));
  };

  // Sub-tabs config per module
  const subTabsMap: Record<string, { id: string; label: string; icon: React.ReactNode }[]> = {
    comparator: [
      { id: 'compare_rates', label: 'Cheapest Insurance & Affordability Finder', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
    ],
    underwriting: [
      { id: 'quote', label: 'Zero-Friction Quoting (3 Qs)', icon: <Shield className="w-3.5 h-3.5" /> },
      { id: 'iot', label: 'IoT Risk-Deflation Engine', icon: <Activity className="w-3.5 h-3.5" /> },
      { id: 'giveback', label: 'Flat-Fee Giveback Ledger', icon: <PieChart className="w-3.5 h-3.5" /> },
    ],
    claims: [
      { id: 'triage', label: '3-Sec AI Computer Vision Triage', icon: <Zap className="w-3.5 h-3.5" /> },
      { id: 'parametric', label: 'Parametric Auto-Settlement Oracles', icon: <Radio className="w-3.5 h-3.5" /> },
      { id: 'fraud', label: 'zk-SNARK & Anomaly Defense', icon: <Lock className="w-3.5 h-3.5" /> },
    ],
    transparency: [
      { id: 'slider', label: 'Coverage vs. Premium Slider', icon: <Sliders className="w-3.5 h-3.5" /> },
      { id: 'value_features', label: '10 Built-In Value-Add Protections', icon: <Sparkles className="w-3.5 h-3.5" /> },
      { id: 'translator', label: 'Jargon-Free Policy Translator', icon: <FileText className="w-3.5 h-3.5" /> },
      { id: 'pooling', label: 'P2P Risk Pools & Dividends', icon: <Users className="w-3.5 h-3.5" /> },
    ],
    cost_elimination: [
      { id: 'agent', label: '24/7 Autonomous AI Agent Service', icon: <Bot className="w-3.5 h-3.5" /> },
      { id: 'payment', label: 'Open Banking 0% Interchange Rail', icon: <CreditCard className="w-3.5 h-3.5" /> },
      { id: 'tiers', label: 'SaaS Subscription Tiers & Surplus', icon: <Coins className="w-3.5 h-3.5" /> },
    ],
  };

  // Handle module change and reset sub-tab
  const handleModuleChange = (mod: 'underwriting' | 'claims' | 'transparency' | 'cost_elimination' | 'comparator') => {
    setActiveModule(mod);
    const firstSub = subTabsMap[mod]?.[0]?.id || 'compare_rates';
    setActiveSubTab(firstSub);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-['Inter'] selection:bg-teal-500/20 selection:text-teal-900">
      {/* Top Universal Nav */}
      <Header
        activeModule={activeModule}
        onSelectModule={handleModuleChange}
        policy={policy}
        surplusWalletBalance={policy.givebackSurplusAccrued}
        monthlyPremium={policy.activeMonthlyPremium}
        onOpenExpressModal={handleOpenExpressModal}
      />

      {/* Ultra-Fast Workflow Quick Bar (Target: < 30 seconds on site) */}
      <ExpressQuickBar
        onOpenExpressModal={handleOpenExpressModal}
        onApplyPreset={handleApplyPreset}
        activePremium={policy.activeMonthlyPremium}
      />

      {/* Main Sub-Navigation Bar */}
      <div className="border-b border-slate-200/90 bg-white/90 backdrop-blur shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {subTabsMap[activeModule]?.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`subtab-${tab.id}`}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono transition-all whitespace-nowrap cursor-pointer min-h-[36px] ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-300/80 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-500 shrink-0">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Node v2026.1.0
            </span>
            <span className="text-slate-300">|</span>
            <span>Zero-Margin Protocol</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* MODULE 0: Comparative Pricing & Affordability */}
        {activeModule === 'comparator' && (
          <div>
            <ComparativePricingEngine
              policy={policy}
              onBindCheapestRate={handleBindCheapestRate}
            />
          </div>
        )}

        {/* MODULE 1: Underwriting */}
        {activeModule === 'underwriting' && (
          <div>
            {activeSubTab === 'quote' && (
              <ZeroFrictionQuote
                onApplyEnrichedQuote={(boundData) => {
                  handleUpdatePolicy(boundData);
                  setActiveSubTab('iot');
                }}
                onQuoteCompleted={(boundData) => {
                  handleUpdatePolicy(boundData);
                  setActiveSubTab('iot');
                }}
              />
            )}
            {activeSubTab === 'iot' && (
              <IoTTelemetryEngine
                devices={devices}
                policy={policy}
                onTriggerSimulatedTelemetry={handleTriggerTelemetry}
                onToggleDevice={handleToggleDevice}
              />
            )}
            {activeSubTab === 'giveback' && (
              <GivebackLedger
                policy={policy}
                onSelectCharity={(charity) => handleUpdatePolicy({ selectedCharity: charity })}
              />
            )}
          </div>
        )}

        {/* MODULE 2: Claims & Fraud */}
        {activeModule === 'claims' && (
          <div>
            {activeSubTab === 'triage' && (
              <InstantClaimsTriage
                claimsHistory={claimsHistory}
                onClaimSettled={handleClaimSettled}
              />
            )}
            {activeSubTab === 'parametric' && (
              <ParametricSettlement onAutoClaimPaid={handleClaimSettled} />
            )}
            {activeSubTab === 'fraud' && <CryptographicFraudDefense />}
          </div>
        )}

        {/* MODULE 3: UX & Transparency */}
        {activeModule === 'transparency' && (
          <div>
            {activeSubTab === 'slider' && (
              <CoverageSlider
                policy={policy}
                onUpdatePolicy={handleUpdatePolicy}
              />
            )}
            {activeSubTab === 'value_features' && (
              <ValueAddFeaturesStudio
                policy={policy}
                onUpdatePolicy={handleUpdatePolicy}
              />
            )}
            {activeSubTab === 'translator' && <PolicyTranslator />}
            {activeSubTab === 'pooling' && <P2PRiskPooling />}
          </div>
        )}

        {/* MODULE 4: Cost Elimination & Tech Stack */}
        {activeModule === 'cost_elimination' && (
          <div>
            {activeSubTab === 'agent' && (
              <AgenticCustomerService
                policy={policy}
                onPolicyMutated={handleUpdatePolicy}
              />
            )}
            {activeSubTab === 'payment' && (
              <PaymentOrchestration
                policy={policy}
                onPaymentRailUpdated={(discount) =>
                  handleUpdatePolicy({
                    openBankingDiscountMonthly: discount,
                    activeMonthlyPremium: Math.max(18, policy.activeMonthlyPremium - (discount - policy.openBankingDiscountMonthly)),
                  })
                }
              />
            )}
            {activeSubTab === 'tiers' && <MonetizationTiers />}
          </div>
        )}
      </main>

      {/* Global Transparency Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs">
              Æ
            </div>
            <div>
              <span className="text-slate-900 font-semibold font-['Cabinet_Grotesk'] text-sm">
                Aequitas Insurance Engine v2026.1.0
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                Nobel-Tier Hyper-Frictionless Risk Protocol • Maximum User Surplus & Zero-Margin Operating Overhead
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Audited Giveback
            </span>
            <span>FedNow / RTP Certified</span>
            <span>zk-SNARK Secured</span>
          </div>
        </div>
      </footer>
      {/* Express Fast-Track Modal (<30s Workflow) */}
      <ExpressFastTrackModal
        isOpen={isExpressModalOpen}
        onClose={() => setIsExpressModalOpen(false)}
        policy={policy}
        onUpdatePolicy={handleUpdatePolicy}
        onAddClaim={handleClaimSettled}
        defaultMode={expressModalMode}
      />
    </div>
  );
}
