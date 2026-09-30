import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { RaftNode, LogEntry, RPCMessage, RaftEvent, NodeRole } from '../types/raft';

interface RaftContextType {
  nodes: RaftNode[];
  globalTerm: number;
  isPartitioned: boolean;
  rpcMessages: RPCMessage[];
  events: RaftEvent[];
  
  // Actions
  triggerClientWrite: (command: string) => void;
  triggerElection: (nodeId?: string) => void;
  togglePartition: () => void;
  toggleKillNode: (nodeId: string) => void;
  reviveAllNodes: () => void;
  stepSimulation: () => void;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
}

const RaftContext = createContext<RaftContextType | null>(null);

const INITIAL_NODES: RaftNode[] = [
  {
    id: 'node-1',
    name: 'Node S1',
    role: 'LEADER',
    currentTerm: 1,
    votedFor: 'node-1',
    logs: [
      { index: 1, term: 1, command: 'SET config.cache = "redis"', isCommitted: true }
    ],
    commitIndex: 1,
    lastApplied: 1,
    partitionGroup: 'A',
    votesReceived: 3,
    x: 400,
    y: 100,
    electionTimeoutMs: 250,
    lastHeartbeatReceived: Date.now()
  },
  {
    id: 'node-2',
    name: 'Node S2',
    role: 'FOLLOWER',
    currentTerm: 1,
    votedFor: 'node-1',
    logs: [
      { index: 1, term: 1, command: 'SET config.cache = "redis"', isCommitted: true }
    ],
    commitIndex: 1,
    lastApplied: 1,
    partitionGroup: 'A',
    votesReceived: 0,
    x: 600,
    y: 220,
    electionTimeoutMs: 280,
    lastHeartbeatReceived: Date.now()
  },
  {
    id: 'node-3',
    name: 'Node S3',
    role: 'FOLLOWER',
    currentTerm: 1,
    votedFor: 'node-1',
    logs: [
      { index: 1, term: 1, command: 'SET config.cache = "redis"', isCommitted: true }
    ],
    commitIndex: 1,
    lastApplied: 1,
    partitionGroup: 'A',
    votesReceived: 0,
    x: 520,
    y: 420,
    electionTimeoutMs: 220,
    lastHeartbeatReceived: Date.now()
  },
  {
    id: 'node-4',
    name: 'Node S4',
    role: 'FOLLOWER',
    currentTerm: 1,
    votedFor: 'node-1',
    logs: [
      { index: 1, term: 1, command: 'SET config.cache = "redis"', isCommitted: true }
    ],
    commitIndex: 1,
    lastApplied: 1,
    partitionGroup: 'B',
    votesReceived: 0,
    x: 280,
    y: 420,
    electionTimeoutMs: 290,
    lastHeartbeatReceived: Date.now()
  },
  {
    id: 'node-5',
    name: 'Node S5',
    role: 'FOLLOWER',
    currentTerm: 1,
    votedFor: 'node-1',
    logs: [
      { index: 1, term: 1, command: 'SET config.cache = "redis"', isCommitted: true }
    ],
    commitIndex: 1,
    lastApplied: 1,
    partitionGroup: 'B',
    votesReceived: 0,
    x: 200,
    y: 220,
    electionTimeoutMs: 240,
    lastHeartbeatReceived: Date.now()
  }
];

export const RaftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<RaftNode[]>(INITIAL_NODES);
  const [globalTerm, setGlobalTerm] = useState<number>(1);
  const [isPartitioned, setIsPartitioned] = useState<boolean>(false);
  const [rpcMessages, setRpcMessages] = useState<RPCMessage[]>([]);
  const [events, setEvents] = useState<RaftEvent[]>([
    {
      id: 'ev-init',
      timeStr: new Date().toISOString().substring(11, 19),
      message: 'Cluster initialized with 5 nodes. Node S1 elected Leader for Term 1.',
      type: 'election'
    }
  ]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const addEvent = (message: string, type: RaftEvent['type']) => {
    const timeStr = new Date().toISOString().substring(11, 19);
    setEvents(prev => [{ id: `ev-${Date.now()}-${Math.random()}`, timeStr, message, type }, ...prev.slice(0, 40)]);
  };

  // Heartbeat loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const leader = nodes.find(n => n.role === 'LEADER');
      if (!leader) return;

      const newRpcs: RPCMessage[] = [];
      nodes.forEach(target => {
        if (target.id === leader.id || target.role === 'DEAD') return;
        if (isPartitioned && leader.partitionGroup !== target.partitionGroup) return;

        newRpcs.push({
          id: `rpc-${Date.now()}-${Math.random()}`,
          fromNodeId: leader.id,
          toNodeId: target.id,
          type: 'AppendEntries',
          term: leader.currentTerm,
          timestamp: Date.now()
        });
      });

      setRpcMessages(newRpcs);
    }, 1800);

    return () => clearInterval(interval);
  }, [nodes, isPaused, isPartitioned]);

  const triggerClientWrite = (command: string) => {
    const leader = nodes.find(n => n.role === 'LEADER');
    if (!leader) {
      addEvent(`❌ Write rejected: No active cluster Leader.`, 'kill');
      return;
    }

    const nextIndex = leader.logs.length + 1;
    const newEntry: LogEntry = {
      index: nextIndex,
      term: leader.currentTerm,
      command,
      isCommitted: false
    };

    // Append to leader
    setNodes(prev => prev.map(n => {
      if (n.id === leader.id) {
        return { ...n, logs: [...n.logs, newEntry] };
      }
      return n;
    }));

    addEvent(`Client write [${command}] sent to Leader ${leader.name}. Replicating across quorum...`, 'commit');

    // Simulate quorum commit after 600ms
    setTimeout(() => {
      setNodes(prev => {
        const liveLeader = prev.find(n => n.id === leader.id);
        if (!liveLeader || liveLeader.role !== 'LEADER') return prev;

        // Check if leader is in majority partition
        const peersInPartition = prev.filter(n => n.role !== 'DEAD' && (!isPartitioned || n.partitionGroup === liveLeader.partitionGroup));
        const hasQuorum = peersInPartition.length >= 3; // Majority of 5 is 3

        if (!hasQuorum) {
          addEvent(`⚠️ Split-Brain Prevention: Leader ${liveLeader.name} cannot reach majority quorum (only ${peersInPartition.length}/5 nodes). Log uncommitted!`, 'partition');
          return prev;
        }

        // Commit on all reachable nodes
        return prev.map(n => {
          if (n.role === 'DEAD') return n;
          if (isPartitioned && n.partitionGroup !== liveLeader.partitionGroup) return n;

          const updatedLogs = n.logs.some(l => l.index === nextIndex)
            ? n.logs.map(l => l.index === nextIndex ? { ...l, isCommitted: true } : l)
            : [...n.logs, { ...newEntry, isCommitted: true }];

          return {
            ...n,
            logs: updatedLogs,
            commitIndex: nextIndex
          };
        });
      });

      addEvent(`✅ Quorum reached (3/5 nodes). Log index ${nextIndex} [${command}] COMMITTED to state machine.`, 'commit');
    }, 600);
  };

  const triggerElection = (candidateId?: string) => {
    const candidate = candidateId 
      ? nodes.find(n => n.id === candidateId)
      : nodes.find(n => n.role === 'FOLLOWER');

    if (!candidate || candidate.role === 'DEAD') return;

    const nextTerm = globalTerm + 1;
    setGlobalTerm(nextTerm);

    setNodes(prev => prev.map(n => {
      if (n.id === candidate.id) {
        return { ...n, role: 'CANDIDATE', currentTerm: nextTerm, votesReceived: 1, votedFor: candidate.id };
      }
      return { ...n, role: n.role === 'LEADER' ? 'FOLLOWER' : n.role };
    }));

    addEvent(`⚡ Election timeout on ${candidate.name}. Transitioned to CANDIDATE for Term ${nextTerm}. Requesting votes...`, 'election');

    // Simulate voting resolution
    setTimeout(() => {
      setNodes(prev => {
        const activeCandidate = prev.find(n => n.id === candidate.id);
        if (!activeCandidate || activeCandidate.role !== 'CANDIDATE') return prev;

        const reachablePeers = prev.filter(n => n.role !== 'DEAD' && (!isPartitioned || n.partitionGroup === activeCandidate.partitionGroup));
        const votes = reachablePeers.length;

        if (votes >= 3) {
          addEvent(`👑 Quorum granted (${votes}/5 votes). ${activeCandidate.name} elected LEADER for Term ${nextTerm}!`, 'election');
          return prev.map(n => {
            if (n.id === activeCandidate.id) {
              return { ...n, role: 'LEADER', votesReceived: votes };
            }
            if (reachablePeers.some(p => p.id === n.id)) {
              return { ...n, role: 'FOLLOWER', votedFor: activeCandidate.id, currentTerm: nextTerm };
            }
            return n;
          });
        } else {
          addEvent(`❌ Election failed for ${activeCandidate.name}: Only ${votes}/5 votes in partition (Majority required: 3).`, 'partition');
          return prev.map(n => n.id === activeCandidate.id ? { ...n, role: 'FOLLOWER' } : n);
        }
      });
    }, 500);
  };

  const togglePartition = () => {
    const nextPartition = !isPartitioned;
    setIsPartitioned(nextPartition);
    if (nextPartition) {
      addEvent(`⚡ NETWORK PARTITION INJECTED! Partition Group A [S1, S2, S3] (Majority: 3) isolated from Group B [S4, S5] (Minority: 2).`, 'partition');
    } else {
      addEvent(`🔄 Network partition HEALED. Cluster re-unified across all 5 nodes.`, 'partition');
    }
  };

  const toggleKillNode = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const nextRole: NodeRole = n.role === 'DEAD' ? 'FOLLOWER' : 'DEAD';
        addEvent(nextRole === 'DEAD' ? `💀 Node ${n.name} killed (Crash failure injected).` : `💚 Node ${n.name} revived and rejoining cluster.`, 'kill');
        return { ...n, role: nextRole };
      }
      return n;
    }));
  };

  const reviveAllNodes = () => {
    setNodes(prev => prev.map(n => ({ ...n, role: n.role === 'DEAD' ? 'FOLLOWER' : n.role })));
    addEvent(`💚 All nodes revived and operational.`, 'kill');
  };

  const stepSimulation = () => {
    triggerElection();
  };

  return (
    <RaftContext.Provider
      value={{
        nodes,
        globalTerm,
        isPartitioned,
        rpcMessages,
        events,
        triggerClientWrite,
        triggerElection,
        togglePartition,
        toggleKillNode,
        reviveAllNodes,
        stepSimulation,
        isPaused,
        setIsPaused
      }}
    >
      {children}
    </RaftContext.Provider>
  );
};

export const useRaft = () => {
  const context = useContext(RaftContext);
  if (!context) {
    throw new Error('useRaft must be used within a RaftProvider');
  }
  return context;
};
