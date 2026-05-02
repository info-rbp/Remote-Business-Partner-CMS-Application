import { useAppStore } from '../../store/useAppStore';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export function GlobalStatusBar() {
  const { firestoreSyncStatus } = useAppStore();

  return (
    <div className="h-8 bg-white border-t border-slate-200 flex items-center px-4 text-xs font-medium text-slate-500 shrink-0">
      <div className="flex flex-1 items-center space-x-4">
        <span>Environment: Production</span>
        <span className="w-px h-3 bg-slate-200" />
        <span>RBP Hub Admin v1.0.0</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {firestoreSyncStatus === 'synced' && (
          <>
            <Cloud className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-600">Firestore Synced</span>
          </>
        )}
        {firestoreSyncStatus === 'syncing' && (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            <span className="text-blue-600">Syncing...</span>
          </>
        )}
        {firestoreSyncStatus === 'error' && (
          <>
            <CloudOff className="w-3.5 h-3.5 text-red-500" />
            <span className="text-red-600">Sync Error</span>
          </>
        )}
      </div>
    </div>
  );
}
