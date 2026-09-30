import React from 'react';
import { useRaft } from '../../context/RaftContext';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReplicatedLogView: React.FC = () => {
  const { nodes } = useRaft();

  return (
    <div className="bg-[#0b0d14] border border-[#1b2234] rounded-3xl p-6 select-none space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b2234]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
            Replicated State Machine Log Ledger
          </h3>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">WAL Index Consistency</span>
      </div>

      {/* Replicated Logs Matrix */}
      <div className="space-y-3">
        {nodes.map(node => (
          <div key={node.id} className="flex items-center gap-3 text-xs font-mono">
            <span className="w-16 text-zinc-400 font-bold shrink-0">{node.name}</span>

            {/* Log Entries Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
              {node.logs.map(log => (
                <div
                  key={log.index}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 ${
                    log.isCommitted
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-75">#{log.index} (T{log.term})</span>
                  <span className="font-sans font-medium text-[11px]">{log.command}</span>
                  {log.isCommitted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
