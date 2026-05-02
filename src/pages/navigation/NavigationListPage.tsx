import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { archiveCmsRecord, publishCmsRecord, restoreCmsRecord } from '../../lib/cmsRepository';
import type { CmsNavigationItem } from '../../types/cms';
import { Plus, FileEdit, Globe, Archive, Loader2, RefreshCw, LayoutTemplate } from 'lucide-react';
import { useState } from 'react';

const AREA_COLORS: Record<string, string> = {
  header: 'bg-blue-100 text-blue-700',
  footer: 'bg-slate-100 text-slate-700',
  mobile: 'bg-violet-100 text-violet-700',
  utility: 'bg-amber-100 text-amber-700',
};

export function NavigationListPage() {
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const { data: navItems, loading, refetch } = useCmsCollection<CmsNavigationItem>(CMS_COLLECTIONS.navigation);
  const [areaFilter, setAreaFilter] = useState('all');

  const filtered = navItems.filter(item => areaFilter === 'all' || item.navArea === areaFilter);

  // Group by area for display
  const grouped = filtered.reduce<Record<string, CmsNavigationItem[]>>((acc, item) => {
    const area = item.navArea || 'header';
    if (!acc[area]) acc[area] = [];
    acc[area].push(item);
    acc[area].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return acc;
  }, {});

  const handlePublish = async (id: string) => {
    if (!adminData || !window.confirm('Publish this nav item? It will appear on the live site.')) return;
    await publishCmsRecord(CMS_COLLECTIONS.navigation, id, adminData);
    refetch();
  };

  const handleArchive = async (id: string) => {
    if (!adminData || !window.confirm('Archive this nav item? It will be removed from the live site.')) return;
    await archiveCmsRecord(CMS_COLLECTIONS.navigation, id, adminData);
    refetch();
  };

  const handleRestore = async (id: string) => {
    if (!adminData) return;
    await restoreCmsRecord(CMS_COLLECTIONS.navigation, id, adminData);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Navigation Manager</h1>
          <p className="text-sm text-slate-500">Manage header, footer, and mobile navigation links.</p>
        </div>
        <button onClick={() => navigate('/navigation/new')}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Nav Item
        </button>
      </div>

      {/* Area Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-2 flex-wrap">
        {['all', 'header', 'footer', 'mobile', 'utility'].map(area => (
          <button key={area} onClick={() => setAreaFilter(area)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
              ${areaFilter === area ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {area === 'all' ? 'All Areas' : area}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <LayoutTemplate className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No navigation items yet. Create one to get started.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([area, items]) => (
          <div key={area} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${AREA_COLORS[area] || 'bg-slate-100 text-slate-700'}`}>
                {area}
              </span>
              <span className="text-xs text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                        ${item.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'archived' ? 'bg-slate-100 text-slate-500' :
                          'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                      </span>
                      {item.isExternal && <span className="text-xs text-slate-400">↗ external</span>}
                    </div>
                    <div className="flex items-center text-xs text-slate-400 space-x-3">
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.href}</code>
                      {item.group && <span>&bull; {item.group}</span>}
                      {item.sortOrder !== undefined && <span>&bull; order: {item.sortOrder}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button onClick={() => navigate(`/navigation/${item.id}/edit`)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <FileEdit className="w-4 h-4" />
                    </button>
                    {item.status !== 'published' && item.status !== 'archived' && (
                      <button onClick={() => handlePublish(item.id!)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Publish">
                        <Globe className="w-4 h-4" />
                      </button>
                    )}
                    {item.status !== 'archived' ? (
                      <button onClick={() => handleArchive(item.id!)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Archive">
                        <Archive className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => handleRestore(item.id!)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Restore">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
