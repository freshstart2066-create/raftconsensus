import React, { useState } from 'react';
import { useRaft } from '../../context/RaftContext';
import { 
  Zap, 
  Flame, 
  RefreshCcw, 
  Send, 
  ShieldAlert, 
  CheckCircle, 
  Terminal,
  Activity
} from 'lucide-react';

export const ChaosControlPanel: React.FC = () => {
  const { 
    triggerClientWrite, 
    triggerElection, 
    togglePartition, 
    isPartitioned, 
    reviveAllNodes,
    events 
  } = useRaft();

  const [commandInput, setCommandInput] = useState('SET user:1001.tier = "enterprise"');

  const handleSendWrite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    triggerClientWrite(commandInput.trim());
  };

  return (
    <div className="w-96 bg-[#0b0d14] border-l border-[#1b2234] h-full flex flex-col justify-between p-5 select-none z-20">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-[#1b2234]">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
            Chaos & Consensus Controls
          </h3>
        </div>

        {/* Client Write Command Entry */}
        <form onSubmit={handleSendWrite} className="space-y-2">
          <label className="text-[11px] font-mono text-zinc-400 block">Propose Key-Value State Write:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="e.g. SET user:42 = active"
              className="flex-1 bg-[#121624] border border-[#1e2638] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer"
              title="Propose Write to Leader"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Chaos Engineering Triggers */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-mono text-zinc-400 block">Fault-Tolerance Experiments:</label>

          {/* Network Partition Injection */}
          <button
            type="button"
            onClick={togglePartition}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-between border transition-all cursor-pointer ${
              isPartitioned
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-lg shadow-rose-900/30'
                : 'bg-[#121624] hover:bg-[#192030] border-[#1e2638] text-zinc-300 hover:text-white'
            }`}
          >
            <span>{isPartitioned ? '⚡ Heal Network Partition' : '⚡ Inject Network Partition'}</span>
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Trigger Leader Re-Election */}
          <button
            type="button"
            onClick={() => triggerElection()}
            className="w-full py-2.5 px-4 bg-[#121624] hover:bg-[#192030] border border-[#1e2638] hover:border-indigo-500/50 rounded-xl text-xs font-mono font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
          >
            <span>Trigger Election Timeout</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </button>

          {/* Revive All Crashed Nodes */}
          <button
            type="button"
            onClick={reviveAllNodes}
            className="w-full py-2.5 px-4 bg-[#121624] hover:bg-[#192030] border border-[#1e2638] hover:border-emerald-500/50 rounded-xl text-xs font-mono font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
          >
            <span>Revive All Crashed Nodes</span>
            <RefreshCcw className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Real-Time Consensus Audit Log Stream */}
      <div className="pt-4 border-t border-[#1b2234] flex-1 flex flex-col justify-end overflow-hidden">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mb-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Consensus Event Log Stream</span>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1.5 text-[10px] font-mono no-scrollbar">
          {events.map(ev => (
            <div key={ev.id} className="p-2 bg-[#08090d] rounded-lg border border-[#1e2638] text-zinc-300">
              <span className="text-zinc-500 mr-1.5">[{ev.timeStr}]</span>
              <span className={
                ev.type === 'commit' ? 'text-emerald-400' :
                ev.type === 'election' ? 'text-amber-300' :
                ev.type === 'partition' ? 'text-rose-400' : 'text-zinc-300'
              }>
                {ev.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
