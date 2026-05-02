import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { archiveCmsRecord, publishCmsRecord, restoreCmsRecord } from '../../lib/cmsRepository';
import type { CmsResource } from '../../types/cms';
import { Plus, Search, FileEdit, Globe, Archive, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function ResourcesListPage() {
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const { data: resources, loading, refetch } = useCmsCollection<CmsResource>(CMS_COLLECTIONS.resources);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePublish = async (id: string) => {
    if (!adminData || !window.confirm('Are you sure you want to publish this resource?')) return;
    await publishCmsRecord(CMS_COLLECTIONS.resources, id, adminData);
    refetch();
  };

  const handleArchive = async (id: string) => {
    if (!adminData || !window.confirm('Are you sure you want to archive this resource? It will be removed from the public website.')) return;
    await archiveCmsRecord(CMS_COLLECTIONS.resources, id, adminData);
    refetch();
  };

  const handleRestore = async (id: string) => {
    if (!adminData) return;
    await restoreCmsRecord(CMS_COLLECTIONS.resources, id, adminData);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resources Manager</h1>
          <p className="text-sm text-slate-500">Manage guides, templates, and case studies.</p>
        </div>
        <button
          onClick={() => navigate('/resources/new')}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Resource
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No resources found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {resource.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${resource.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        resource.status === 'archived' ? 'bg-slate-100 text-slate-600' : 
                        'bg-amber-100 text-amber-700'}`}
                    >
                      {resource.status}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 space-x-3">
                    <span className="capitalize">{resource.resourceType}</span>
                    <span>&bull;</span>
                    <span className="truncate">/{resource.slug}</span>
                    <span>&bull;</span>
                    <span className="truncate">{resource.category || 'No category'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/resources/${resource.id}/edit`)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                  
                  {resource.status !== 'published' && resource.status !== 'archived' && (
                    <button
                      onClick={() => handlePublish(resource.id!)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Publish"
                    >
                      <Globe className="w-4 h-4" />
                    </button>
                  )}

                  {resource.status !== 'archived' ? (
                    <button
                      onClick={() => handleArchive(resource.id!)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRestore(resource.id!)}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Restore to Draft"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
