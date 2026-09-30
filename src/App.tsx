import React from 'react';
import { RaftProvider } from './context/RaftContext';
import { RaftHeader } from './components/header/RaftHeader';
import { ClusterTopology } from './components/cluster/ClusterTopology';
import { ReplicatedLogView } from './components/logtimeline/ReplicatedLogView';
import { ChaosControlPanel } from './components/controls/ChaosControlPanel';

export const AppContent: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090e] text-zinc-100 overflow-hidden select-none font-sans">
      {/* Top Navigation */}
      <RaftHeader />

      {/* Main Distributed Sandbox Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Cluster Topology & Replicated Logs */}
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto no-scrollbar">
          <ClusterTopology />
          <ReplicatedLogView />
        </div>

        {/* Right: Chaos & Fault-Tolerance Controls */}
        <ChaosControlPanel />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RaftProvider>
      <AppContent />
    </RaftProvider>
  );
};

export default App;
