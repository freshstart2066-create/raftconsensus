import React from 'react';
import { useRaft } from '../../context/RaftContext';
import { 
  Crown, 
  Server, 
  Skull, 
  Radio, 
  Zap, 
  ShieldAlert,
  Layers,
  Power
} from 'lucide-react';
import { RaftNode } from '../../types/raft';

export const ClusterTopology: React.FC = () => {
  const { nodes, isPartitioned, rpcMessages, toggleKillNode, triggerElection } = useRaft();

  return (
    <div className="relative flex-1 h-[440px] bg-[#0b0d14] border border-[#1b2234] rounded-3xl overflow-hidden p-6 select-none flex items-center justify-center">
      {/* Network Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3861fb 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Network Partition Split-Brain Visual Barrier */}
      {isPartitioned && (
        <div className="absolute inset-y-0 left-1/2 w-1 bg-gradient-to-b from-transparent via-rose-500 to-transparent shadow-[0_0_20px_#f43f5e] z-10 flex items-center justify-center">
          <div className="bg-rose-950/90 text-rose-400 border border-rose-500/50 px-3 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap shadow-xl">
            NETWORK PARTITION BARRIER (SPLIT-BRAIN)
          </div>
        </div>
      )}

      {/* SVG RPC Packet Broadcast Stream */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {rpcMessages.map(rpc => {
          const fromNode = nodes.find(n => n.id === rpc.fromNodeId);
          const toNode = nodes.find(n => n.id === rpc.toNodeId);
          if (!fromNode || !toNode) return null;

          return (
            <g key={rpc.id}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#3861fb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              <circle r="4" fill="#00f0ff" className="filter drop-shadow-[0_0_6px_#00f0ff]">
                <animate
                  attributeName="cx"
                  from={fromNode.x}
                  to={toNode.x}
                  dur="0.6s"
                  repeatCount="1"
                />
                <animate
                  attributeName="cy"
                  from={fromNode.y}
                  to={toNode.y}
                  dur="0.6s"
                  repeatCount="1"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Render Raft Nodes */}
      <div className="relative z-20 w-full h-full">
        {nodes.map(node => {
          const isLeader = node.role === 'LEADER';
          const isCandidate = node.role === 'CANDIDATE';
          const isDead = node.role === 'DEAD';

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${node.x - 70}px, ${node.y - 50}px)`,
                width: 140
              }}
              className={`absolute p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                isLeader
                  ? 'bg-[#151c2e] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
                  : isCandidate
                  ? 'bg-[#1e1629] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : isDead
                  ? 'bg-[#121217] border-zinc-800 opacity-50'
                  : 'bg-[#0f131f] border-[#1e2638] hover:border-zinc-500'
              }`}
            >
              {/* Node Card Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {isLeader && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  {isCandidate && <Radio className="w-4 h-4 text-purple-400 animate-pulse" />}
                  {isDead && <Skull className="w-4 h-4 text-zinc-500" />}
                  {!isLeader && !isCandidate && !isDead && <Server className="w-4 h-4 text-indigo-400" />}
                  <span className="text-xs font-bold text-white font-mono">{node.name}</span>
                </div>

                {/* Kill / Revive Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleKillNode(node.id);
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    isDead ? 'text-zinc-600 hover:text-emerald-400' : 'text-zinc-500 hover:text-rose-400'
                  }`}
                  title={isDead ? 'Revive Node' : 'Kill Node'}
                >
                  <Power className="w-3 h-3" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                  isLeader ? 'bg-amber-400/20 text-amber-300' :
                  isCandidate ? 'bg-purple-500/20 text-purple-300' :
                  isDead ? 'bg-zinc-800 text-zinc-500' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {node.role}
                </span>
                <span className="text-zinc-400">Term {node.currentTerm}</span>
              </div>

              {/* Log Commit Stats */}
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1 border-t border-[#1e2638]">
                <span>Logs: {node.logs.length}</span>
                <span className="text-emerald-400">Commit: #{node.commitIndex}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
