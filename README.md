# 🗳️ RaftConsensus — Interactive Distributed Consensus & Chaos Engineering Simulator

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**RaftConsensus** is a high-fidelity visual simulator and interactive chaos engineering laboratory for the Raft Distributed Consensus Algorithm (Ongaro & Ousterhout).

Designed for distributed systems engineers and architects to model, explore, and stress-test leader election, term progression, log entry replication, cluster state partitions, and split-vote scenarios in real time.

---

## 🏛️ Raft State Machine Architecture

```mermaid
stateDiagram-v2
    [*] --> Follower: Node Initialization
    Follower --> Candidate: Election Timeout Elapsed (Heartbeat Missing)
    Candidate --> Candidate: Split Vote / Split Term (New Random Timeout)
    Candidate --> Leader: Quorum Majorities (Votes > N/2)
    Candidate --> Follower: Discovers Leader / Higher Term
    Leader --> Follower: Discovers Higher Term Peer
```

---

## ⚡ Core Features & Subsystems

- **Dynamic Cluster Topology (5-Node Mesh)**: Real-time node state visualizer rendering live node roles (*Leader, Candidate, Follower*), current term indices, and vote tallies.
- **Heartbeat & RPC Packet Simulation**: Visualized request-vote and append-entries RPC message passing with configurable latency and drop rates.
- **Chaos Engineering Control Panel**:
  - 💥 **Kill / Revive Nodes**: Inject sudden crash failures to observe automatic failover and leader re-election.
  - 🌐 **Network Partition (Split-Brain)**: Partition the cluster into isolated sub-groups to demonstrate majority vs minority partition safety.
  - ⏱️ **Election Timeout Jitter**: Tweak min/max randomized election timer windows (150ms–300ms) to trigger candidate split-vote contention.
- **Replicated Log & Commit Index Timeline**: Step-by-step uncommitted vs committed log index audit view demonstrating strong leader log matching property.

---

## 🛠️ Tech Stack & Implementation Details

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **State Engine**: Centralized Raft Context State Machine with asynchronous heartbeat timers and message queue dispatchers.
- **Build / Tooling**: Vite 6, Oxlint.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/freshstart2066-create/raftconsensus.git
cd raftconsensus

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 📄 License

Licensed under the **Apache License, Version 2.0**.
