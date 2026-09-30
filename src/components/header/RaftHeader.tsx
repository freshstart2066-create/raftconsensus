import React from 'react';
import { useRaft } from '../../context/RaftContext';
import { 
  Network, 
  Crown, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Github, 
  Pause, 
  Play 
} from 'lucide-react';

export const RaftHeader: React.FC = () => {
  const { globalTerm, nodes, isPartitioned, isPaused, setIsPaused } = useRaft();
  const leader = nodes.find(n => n.role === 'LEADER');
  const aliveNodes = nodes.filter(n => n.role !== 'DEAD').length;

  return (
    <header className="h-16 bg-[#090b10] border-b border-[#1b2234] px-6 flex items-center justify-between select-none z-30">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Network className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm font-mono tracking-wider">RAFT<span className="text-amber-400">CONSENSUS</span></span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30 font-mono">
                DISTRIBUTED ENGINE
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">Leader Election, Log Replication & Split-Brain Prevention</p>
          </div>
        </div>

        {/* Global Term & Quorum Readouts */}
        <div className="hidden md:flex items-center gap-4 bg-[#0f131f] border border-[#1b2234] px-4 py-1.5 rounded-xl text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Term:</span>
            <span className="text-amber-400 font-bold">#{globalTerm}</span>
          </div>
          <div className="border-l border-[#1b2234] pl-4 flex items-center gap-2">
            <span className="text-zinc-500">Leader:</span>
            <span className="text-white font-bold">{leader ? leader.name : 'NO LEADER (ELECTION)'}</span>
          </div>
          <div className="border-l border-[#1b2234] pl-4 flex items-center gap-2">
            <span className="text-zinc-500">Cluster Quorum:</span>
            <span className="text-emerald-400 font-bold">{aliveNodes}/5 Nodes</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f131f] hover:bg-[#161c2e] border border-[#1b2234] rounded-xl text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isPaused ? 'Resume Ticks' : 'Pause'}</span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/freshstart2066-create/raftconsensus"
          target="_blank"
          rel="noreferrer"
          className="p-2 bg-[#0f131f] hover:bg-[#161c2e] border border-[#1b2234] text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          title="View GitHub Repository"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </header>
  );
};
