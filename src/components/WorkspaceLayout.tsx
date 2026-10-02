// src/components/WorkspaceLayout.tsx
'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardView from './views/DashboardView';
import ChecklistView from './views/ChecklistView';
import MediationView from './views/MediationView';
import AcornWalletView from './views/AcornWalletView';

export default function WorkspaceLayout() {
  const [activePath, setActivePath] = useState('dashboard');

  const renderView = () => {
    switch (activePath) {
      case 'dashboard':
        return <DashboardView onNavigate={setActivePath} />;
      case 'checklist':
        return <ChecklistView onNavigate={setActivePath} />;
      case 'mediation':
        return <MediationView onNavigate={setActivePath} />;
      case 'acorn':
        return <AcornWalletView onNavigate={setActivePath} />;
      default:
        return <DashboardView onNavigate={setActivePath} />;
    }
  };

  return (
    <>
      <Header />
      <Sidebar activePath={activePath} onNavigate={setActivePath} />
      <div className="pl-72">
        <main className="relative w-full pt-16 min-h-screen bg-background px-4 lg:px-8 py-6">
          <div className="flex flex-col w-full pb-16">
            {renderView()}
          </div>
        </main>
      </div>
    </>
  );
}
