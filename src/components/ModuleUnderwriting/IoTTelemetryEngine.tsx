import React, { useState } from 'react';
import { 
  Activity, 
  Droplet, 
  Car, 
  Flame, 
  RefreshCw, 
  Sparkles,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { IoTDeviceStream, UserPolicy } from '../../types';

interface IoTTelemetryEngineProps {
  devices: IoTDeviceStream[];
  policy: UserPolicy;
  onTriggerSimulatedTelemetry: (deviceId: string, eventName: string, additionalDiscount: number) => void;
  onToggleDevice: (deviceId: string) => void;
}

export const IoTTelemetryEngine: React.FC<IoTTelemetryEngineProps> = ({
  devices,
  policy,
  onTriggerSimulatedTelemetry,
  onToggleDevice,
}) => {
  const [activeSimulationMsg, setActiveSimulationMsg] = useState<string | null>(null);

  const handleSimulate = (deviceId: string, type: string) => {
    let msg = '';
    let discount = 1.20;

    if (type === 'water_sensor') {
      msg = '⚡ Moen Flo detected 0.04 gpm micro-drip on guest bath supply; auto-isolated in 420ms! Water loss prevented: ~$12,500. Rate deflated by -$2.10/mo.';
      discount = 2.10;
    } else if (type === 'vehicle_telematics') {
      msg = '🚗 Tesla Fleet telematics: 48.2 commute miles logged with 0 forward collision warnings and 100% follow distance. Safety score increased to 98.6! Rate deflated by -$1.80/mo.';
      discount = 1.80;
    } else if (type === 'wearable_biometrics') {
      msg = '❤️ Apple Health: 30 consecutive days of 10k steps and optimal resting HRV verified. Vitality index +4%. Rate deflated by -$1.50/mo.';
      discount = 1.50;
    } else {
      msg = '🔥 Dual-spectrum thermal array self-test: 0 ppm CO, zero dust obstruction. Rate deflated by -$0.80/mo.';
      discount = 0.80;
    }

    setActiveSimulationMsg(msg);
    onTriggerSimulatedTelemetry(deviceId, msg, discount);

    setTimeout(() => {
      setActiveSimulationMsg(null);
    }, 6000);
  };

  const totalMonthlyIoTDiscount = devices.reduce((sum, d) => sum + (d.status !== 'SYNCING' ? d.monthlySavings : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono mb-3">
              <Activity className="w-3.5 h-3.5 text-emerald-300" />
              Module 1: IoT & Telematics Risk-Deflation Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Continuous Risk-Deflation Telemetry Stream
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Traditional insurance penalizes safe customers to pay for reckless ones. Aequitas ingests real-time telemetry from smart water shutoffs, connected vehicles, and biometric wearables, dynamically reducing your premium in real-time as safe habits prevent losses.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-emerald-200">Total Active IoT Savings</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">
              -${totalMonthlyIoTDiscount.toFixed(2)}/mo
            </div>
            <p className="text-xs text-emerald-200/90 font-mono mt-1">Cuts claims frequency by ~30%</p>
          </div>
        </div>
      </div>

      {/* Live Simulation Alert */}
      {activeSimulationMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-2">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <strong className="text-emerald-900 font-mono font-bold">LIVE TELEMETRY STREAM PROCESSED:</strong> {activeSimulationMsg}
          </div>
        </div>
      )}

      {/* Connected Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isWater = device.type === 'water_sensor';
          const isCar = device.type === 'vehicle_telematics';
          const isSmoke = device.type === 'smoke_heat_sensor';

          return (
            <div
              key={device.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 shadow-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isWater 
                        ? 'bg-teal-50 border-teal-200 text-teal-700'
                        : isCar
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {isWater && <Droplet className="w-5 h-5" />}
                      {isCar && <Car className="w-5 h-5" />}
                      {isSmoke && <Flame className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm font-['Cabinet_Grotesk']">
                        {device.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {device.deviceBrand}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {device.status}
                  </span>
                </div>

                {/* Current Metric Reading */}
                <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-medium">Live Reading</div>
                  <div className="text-xs font-mono text-slate-800 font-semibold mt-0.5 truncate">
                    {device.currentMetric}
                  </div>
                </div>

                {/* Deflation Rate Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-slate-600 text-[10px] block">Risk Deflated</span>
                    <span className="text-emerald-700 font-bold">-{device.riskDeflationPercent}%</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-slate-600 text-[10px] block">Monthly Saved</span>
                    <span className="text-emerald-700 font-bold">-${device.monthlySavings.toFixed(2)}</span>
                  </div>
                </div>

                {/* Recent Telemetry Logs */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-medium block">Telemetry Log Feed</span>
                  {device.telemetryLogs.slice(0, 2).map((log, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 flex items-center justify-between gap-2">
                      <span className="truncate">{log.event}</span>
                      <span className="text-teal-700 font-mono text-[10px] font-semibold shrink-0">{log.safetyScore} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Trigger Live Event Simulation */}
              <button
                id={`btn-simulate-telemetry-${device.id}`}
                type="button"
                onClick={() => handleSimulate(device.id, device.type)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-700" />
                <span>Simulate Threat Prevention Event</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-time Deflation Actuarial Math Explainer */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 text-base font-['Cabinet_Grotesk']">
              Why IoT Threat Prevention Eradicates Insurance Loss Ratio
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
            30% Loss Frequency Cut
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-1">1. Water Damage Prevention</h5>
            <p>Water damage accounts for 24% of all homeowner claims. Smart shutoff valves isolate micro-bursts before drywall or hardwood floor flooding occurs.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-1">2. Connected EV Telematics</h5>
            <p>Drivers with forward collision radar telemetry and low late-night trip frequency have 72% fewer bodily injury liability accidents.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-1">3. Direct Surplus Pass-Through</h5>
            <p>Unlike traditional carriers who pocket safety savings as quarterly profits, Aequitas immediately discounts your next billing cycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
