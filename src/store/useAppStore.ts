import { create } from 'zustand';

export type ProjectHub = 
  | 'on-demand-hub'
  | 'docushare'
  | 'managed-services'
  | 'business-marketplace'
  | 'operations-finance'
  | 'strategic-offers'
  | 'knowledge-hub'
  | 'app-directory';

interface AppState {
  activeProject: ProjectHub | null;
  setActiveProject: (project: ProjectHub | null) => void;
  firestoreSyncStatus: 'synced' | 'syncing' | 'error';
  setFirestoreSyncStatus: (status: 'synced' | 'syncing' | 'error') => void;
  branding: {
    primaryColor: string;
    accentColor: string;
    borderRadius: string;
  };
  setBranding: (branding: { primaryColor: string; accentColor: string; borderRadius: string }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  firestoreSyncStatus: 'synced',
  setFirestoreSyncStatus: (status) => set({ firestoreSyncStatus: status }),
  branding: {
    primaryColor: '#0f172a',
    accentColor: '#2563eb',
    borderRadius: '1.5rem', // 3xl
  },
  setBranding: (branding) => set({ branding }),
}));
