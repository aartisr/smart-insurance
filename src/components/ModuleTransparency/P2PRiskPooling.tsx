import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  Home, 
  Car, 
  Bike, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { P2PPool } from '../../types';
import { P2P_POOLS } from '../../data/mockData';

export const P2PRiskPooling: React.FC = () => {
  const [pools, setPools] = useState<P2PPool[]>(P2P_POOLS);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolCategory, setNewPoolCategory] = useState('Smart Home');
  const [newPoolDescription, setNewPoolDescription] = useState('');

  const handleToggleJoinPool = (poolId: string) => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === poolId) {
          const nextJoined = !p.isJoined;
          if (nextJoined) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#0d9488', '#10b981'],
            });
          }
          return {
            ...p,
            isJoined: nextJoined,
            membersCount: nextJoined ? p.membersCount + 1 : p.membersCount - 1,
            totalPooledReserve: nextJoined ? p.totalPooledReserve + 300 : p.totalPooledReserve - 300,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoolName) return;

    const created: P2PPool = {
      id: 'pool-' + Math.floor(1000 + Math.random() * 9000),
      name: newPoolName,
      category: newPoolCategory,
      membersCount: 1,
      totalPooledReserve: 300,
      currentClaimsDrawn: 0,
      projectedAnnualDividendPerMember: 300,
      moralHazardScore: 99,
      isJoined: true,
      avatarIcon: 'Users',
      description: newPoolDescription || 'Private social risk syndicate sharing low-tier reserve buffer.',
    };

    setPools((prev) => [created, ...prev]);
    setIsCreatingPool(false);
    setNewPoolName('');
    setNewPoolDescription('');

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white shadow-md">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono mb-3">
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              Module 3: Peer-to-Peer Risk Pooling
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Cabinet_Grotesk']">
              Social Sub-Pools & Shared Leftover Dividends
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Form small, trusted risk sub-pools with friends, neighborhood HOAs, or verified safe driver fleets. Members share first-dollar deductible risk and <strong>split 100% of leftover pooled funds at the end of the year</strong> as cash dividends.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[240px] text-right shadow-xs">
            <span className="text-[11px] font-mono uppercase text-emerald-200">Moral Hazard Deflation</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono mt-0.5">96% High Trust</div>
            <p className="text-xs text-slate-300 mt-1">Zero fraudulent claims in verified pools</p>
          </div>
        </div>
      </div>

      {/* Action to create new P2P pool */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 font-['Cabinet_Grotesk']">Active Social Risk Pools</h3>
        <button
          id="btn-open-create-pool-modal"
          type="button"
          onClick={() => setIsCreatingPool(!isCreatingPool)}
          className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>{isCreatingPool ? 'Cancel' : 'Create Custom P2P Sub-Pool'}</span>
        </button>
      </div>

      {/* Create Pool Form Drawer */}
      {isCreatingPool && (
        <form onSubmit={handleCreatePool} className="bg-white border border-teal-500/40 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in">
          <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2 font-['Cabinet_Grotesk']">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Launch a New Social Risk Syndicate
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Pool Name</label>
              <input
                id="input-pool-name"
                type="text"
                required
                value={newPoolName}
                onChange={(e) => setNewPoolName(e.target.value)}
                placeholder="e.g. Austin South-Congress Eco Homeowners"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Category</label>
              <select
                id="select-pool-category"
                value={newPoolCategory}
                onChange={(e) => setNewPoolCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
              >
                <option value="Smart Home">Smart Home (Flo Water / Smoke Sensor Monitored)</option>
                <option value="Connected EV">Connected EV / Safe Driver Fleet</option>
                <option value="Micro-Mobility">Urban Cyclist / Micro-Mobility</option>
                <option value="Solar & Storage">Solar Rooftop & Battery Syndicate</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Pool Covenant / Description</label>
            <input
              id="input-pool-description"
              type="text"
              value={newPoolDescription}
              onChange={(e) => setNewPoolDescription(e.target.value)}
              placeholder="e.g. All members maintain IoT water shutoffs and split annual reserve rebates..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>
          <button
            id="btn-submit-create-pool"
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase font-mono tracking-wider cursor-pointer shadow-xs"
          >
            Deploy P2P Pool Smart Contract
          </button>
        </form>
      )}

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pools.map((pool) => {
          const isHome = pool.avatarIcon === 'Home';
          const isCar = pool.avatarIcon === 'Car';
          const isBike = pool.avatarIcon === 'Bike';

          return (
            <div
              key={pool.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm ${
                pool.isJoined
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                      {isHome && <Home className="w-5 h-5" />}
                      {isCar && <Car className="w-5 h-5" />}
                      {isBike && <Bike className="w-5 h-5" />}
                      {!isHome && !isCar && !isBike && <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm font-['Cabinet_Grotesk']">{pool.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">{pool.category}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                    pool.isJoined ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {pool.isJoined ? 'MEMBER' : 'OPEN'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {pool.description}
                </p>

                {/* Pool Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block font-medium">Pooled Reserve</span>
                    <span className="text-slate-900 font-bold">${pool.totalPooledReserve.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block font-medium">Annual Div / Member</span>
                    <span className="text-emerald-700 font-bold">+${pool.projectedAnnualDividendPerMember.toFixed(2)}</span>
                  </div>
                </div>

                {/* Members & Trust Score */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>{pool.membersCount} Verified Peers</span>
                  <span className="text-teal-700 font-semibold">Moral Trust: {pool.moralHazardScore}/100</span>
                </div>
              </div>

              {/* Join / Leave button */}
              <button
                id={`btn-join-pool-${pool.id}`}
                type="button"
                onClick={() => handleToggleJoinPool(pool.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  pool.isJoined
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                {pool.isJoined ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Member (Earn Rebate)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-teal-700" />
                    <span>Join Syndicate Sub-Pool</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
