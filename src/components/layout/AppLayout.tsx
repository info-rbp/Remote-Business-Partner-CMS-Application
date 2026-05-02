import React from 'react';
import { Sidebar } from './Sidebar';
import { GlobalStatusBar } from './GlobalStatusBar';
import { useAppStore } from '../../store/useAppStore';
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { branding } = useAppStore();

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden bg-slate-50"
      style={{
        '--color-slate-900': branding.primaryColor,
        '--color-blue-600': branding.accentColor,
        '--color-blue-500': branding.accentColor,
      } as React.CSSProperties}
    >
      <style>
        {`
          .rounded-3xl {
            border-radius: ${branding.borderRadius} !important;
          }
          .rounded-xl {
            border-radius: calc(${branding.borderRadius} * 0.5) !important;
          }
          .rounded-2xl {
            border-radius: calc(${branding.borderRadius} * 0.75) !important;
          }
        `}
      </style>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      <GlobalStatusBar />
    </div>
  );
}
