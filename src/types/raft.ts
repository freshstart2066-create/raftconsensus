export type NodeRole = 'LEADER' | 'FOLLOWER' | 'CANDIDATE' | 'DEAD';

export interface LogEntry {
  index: number;
  term: number;
  command: string;
  isCommitted: boolean;
}

export interface RaftNode {
  id: string;
  name: string;
  role: NodeRole;
  currentTerm: number;
  votedFor: string | null;
  logs: LogEntry[];
  commitIndex: number;
  lastApplied: number;
  partitionGroup: 'A' | 'B';
  votesReceived: number;
  x: number;
  y: number;
  electionTimeoutMs: number;
  lastHeartbeatReceived: number;
}

export interface RPCMessage {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'RequestVote' | 'VoteGranted' | 'AppendEntries' | 'AppendEntriesAck';
  term: number;
  timestamp: number;
}

export interface RaftEvent {
  id: string;
  timeStr: string;
  message: string;
  type: 'election' | 'heartbeat' | 'commit' | 'partition' | 'kill';
}
