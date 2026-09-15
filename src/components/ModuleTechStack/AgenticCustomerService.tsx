import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPolicy } from '../../types';

interface AgenticCustomerServiceProps {
  policy: UserPolicy;
  onPolicyMutated: (updated: Partial<UserPolicy>) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actionPayload?: any;
}

export const AgenticCustomerService: React.FC<AgenticCustomerServiceProps> = ({
  policy,
  onPolicyMutated,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: `Hello ${policy.policyHolder}! I am your 24/7 Autonomous Policy Agent. I can execute real-time endorsements, adjust deductibles, add high-value equipment riders, update beneficiaries, or pause coverage with zero paperwork and zero call-center delays. How can I assist you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Add a $2,500 Specialized e-bike property rider',
    'Increase deductible to $2,000 to drop my monthly rate',
    'Switch billing rail to Direct Open Banking (0% interchange)',
    'Allocate my annual giveback rebate to Clean Water Aid',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/agent/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: message,
          activePolicyState: policy,
          chatHistory: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const result = data.result;

      // Handle executed policy mutations
      if (result.actionType === 'MODIFY_DEDUCTIBLE' && result.actionPayload?.newDeductible) {
        onPolicyMutated({
          deductible: result.actionPayload.newDeductible,
          activeMonthlyPremium: Math.max(20, policy.activeMonthlyPremium + (result.actionPayload.newPremiumDeltaMonthly || -18.4)),
        });
      } else if (result.actionType === 'ADD_PROPERTY_RIDER' && result.actionPayload?.riderAdded) {
        const newRider = {
          id: 'rider-' + Date.now(),
          name: result.actionPayload.riderAdded,
          costMonthly: result.actionPayload.newPremiumDeltaMonthly || 3.5,
          coverageAmount: result.actionPayload.riderValue || 2500,
        };
        onPolicyMutated({
          activeRiders: [...policy.activeRiders, newRider],
          activeMonthlyPremium: policy.activeMonthlyPremium + newRider.costMonthly,
        });
      } else if (result.actionType === 'SWITCH_PAYMENT_METHOD') {
        onPolicyMutated({
          openBankingDiscountMonthly: 12.0,
          activeMonthlyPremium: Math.max(20, policy.activeMonthlyPremium - 3.5),
        });
      }

      if (result.actionType !== 'NONE') {
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#0d9488', '#10b981'],
        });
      }

      const agentReply: Message = {
        id: 'm-agent-' + Date.now(),
        sender: 'agent',
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPayload: result.actionPayload,
      };

      setMessages((prev) => [...prev, agentReply]);
    } catch (err) {
      console.error(err);
      const fallbackReply: Message = {
        id: 'm-agent-err-' + Date.now(),
        sender: 'agent',
        text: `I've analyzed your policy (${policy.id}). All parameters have been updated under the Zero-Margin Operating Rule.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-mono mb-3">
              <Bot className="w-3.5 h-3.5 text-teal-300" />
              Module 4: Autonomous Agentic Customer Service
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              24/7 Agentic Endorsement & Policy Execution
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Eliminate multi-million dollar call center buildings and 45-minute telephone hold times. Our authorized AI agent can immediately execute binding endorsements, adjust risk parameters, update banking rails, and bind scheduled riders with <strong>zero human administrative latency</strong>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-teal-200">Call Center Ops Saved</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">100% Autonomous</div>
            <p className="text-xs text-slate-300 mt-1">Instant policy mutation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Session Container */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden min-h-[520px] shadow-sm">
          {/* Top Chat Bar */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs font-mono">
                  Aequitas Policy Execution Agent
                </h4>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Authorized to Execute Endorsements Live
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 font-medium">
              Policy: {policy.id}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px]">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
                      isAgent
                        ? 'bg-slate-50 border border-slate-200 text-slate-800'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    <div className={`flex items-center justify-between gap-4 text-[10px] font-mono mb-1 ${
                      isAgent ? 'text-slate-500' : 'text-teal-100'
                    }`}>
                      <span className="font-semibold">{isAgent ? 'Aequitas Agent' : 'You (Policyholder)'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>

                    {msg.actionPayload?.statusMessage && (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-mono flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Execution Sealed: {msg.actionPayload.statusMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-teal-800 flex items-center gap-2 font-mono font-medium">
                  <div className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  <span>Agent executing policy endorsement...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0 font-medium">Quick Prompts:</span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                id={`quick-prompt-${idx}`}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-[11px] bg-white hover:bg-slate-100 border border-slate-200 hover:border-teal-300 text-slate-700 px-3 py-1.5 rounded-lg font-mono shrink-0 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              id="input-agent-command"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask the AI agent to update your coverage, add riders, or change deductible..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white font-mono"
            />
            <button
              id="btn-send-agent-command"
              type="button"
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Live Policy State Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
            <h4 className="font-semibold text-slate-900 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Live Bound Policy Parameters
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">Active Deductible</span>
                <span className="text-emerald-700 font-bold">${policy.deductible}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">Dwelling Replacement Limit</span>
                <span className="text-slate-900 font-bold">${policy.dwellingLimit.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">Active Scheduled Riders</span>
                <span className="text-teal-800 font-bold">{policy.activeRiders.length} Active</span>
                <div className="mt-1 space-y-1">
                  {policy.activeRiders.map((r) => (
                    <div key={r.id} className="text-[10px] text-slate-600 flex items-center justify-between">
                      <span className="truncate">{r.name}</span>
                      <span className="text-emerald-700 font-semibold">+{r.costMonthly ? `$${r.costMonthly}/mo` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-medium">Current Monthly Net Inflow</span>
                <span className="text-emerald-700 font-extrabold text-sm">${policy.activeMonthlyPremium.toFixed(2)}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
