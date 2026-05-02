import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Megaphone, Plus, Search, FileEdit, Globe, Archive, Loader2, RefreshCw, X, Settings2, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCmsCollection } from '../hooks/useCmsCollection';
import { CMS_COLLECTIONS } from '../lib/cmsCollections';
import { createCmsRecord, updateCmsRecord, publishCmsRecord, archiveCmsRecord, restoreCmsRecord } from '../lib/cmsRepository';
import { CampaignForm } from '../components/campaigns/CampaignForm';
import type { CmsCampaign } from '../types/cms';

export function CampaignsSEO() {
  const { adminData } = useAuth();
  const { data: campaigns, loading, refetch } = useCmsCollection<CmsCampaign>(CMS_COLLECTIONS.campaigns);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CmsCampaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (data: any, isPublishing: boolean) => {
    if (!adminData) return;
    try {
      let id = editingCampaign?.id;
      if (id) {
        await updateCmsRecord(CMS_COLLECTIONS.campaigns, id, data, adminData);
      } else {
        id = await createCmsRecord(CMS_COLLECTIONS.campaigns, { ...data, status: 'draft', isPublished: false }, adminData);
      }

      if (isPublishing && id) {
        await publishCmsRecord(CMS_COLLECTIONS.campaigns, id, adminData);
      }
      
      setIsAdding(false);
      setEditingCampaign(null);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to save campaign');
    }
  };

  const handlePublish = async (id: string) => {
    if (!adminData) return;
    await publishCmsRecord(CMS_COLLECTIONS.campaigns, id, adminData);
    refetch();
  };

  const handleArchive = async (id: string) => {
    if (!adminData) return;
    await archiveCmsRecord(CMS_COLLECTIONS.campaigns, id, adminData);
    refetch();
  };

  const handleRestore = async (id: string) => {
    if (!adminData) return;
    await restoreCmsRecord(CMS_COLLECTIONS.campaigns, id, adminData);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns & SEO</h1>
          <p className="text-slate-500 mt-1">Manage marketing banners and global SEO strategies.</p>
        </div>
        <button onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Campaigns List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Megaphone className="w-5 h-5 mr-2 text-slate-900" /> Active Campaigns
              </CardTitle>
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 outline-none" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Megaphone className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  <p className="text-sm">No campaigns found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredCampaigns.map(campaign => (
                    <div key={campaign.id} className="py-4 flex items-center justify-between hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">{campaign.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${campaign.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                              campaign.status === 'archived' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{campaign.content}</p>
                        <div className="flex items-center mt-2 space-x-3 text-[10px] text-slate-400">
                          <span className="capitalize">{campaign.campaignType}</span>
                          <span>&bull;</span>
                          <span className="capitalize">{campaign.placement.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button onClick={() => setEditingCampaign(campaign)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"><FileEdit className="w-4 h-4" /></button>
                        {campaign.status !== 'published' && campaign.status !== 'archived' && (
                          <button onClick={() => handlePublish(campaign.id!)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Globe className="w-4 h-4" /></button>
                        )}
                        {campaign.status !== 'archived' ? (
                          <button onClick={() => handleArchive(campaign.id!)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Archive className="w-4 h-4" /></button>
                        ) : (
                          <button onClick={() => handleRestore(campaign.id!)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><RefreshCw className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: SEO Quick Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-slate-900" />Global SEO Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs leading-relaxed flex items-start">
                <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                Global SEO titles, descriptions, and OG images are managed in Site Settings.
              </div>
              <a href="/settings?tab=site" className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="flex items-center">
                  <Settings2 className="w-4 h-4 mr-2 text-slate-400 group-hover:text-slate-900" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Manage SEO Settings</span>
                </div>
                <RefreshCw className="w-3 h-3 text-slate-300 group-hover:text-slate-900" />
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Campaign Priority</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 leading-relaxed">
                If multiple campaigns target the same placement, the one with the highest priority value will be shown. Drafts and archived campaigns are never displayed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for adding/editing */}
      {(isAdding || editingCampaign) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{isAdding ? 'Create New Campaign' : 'Edit Campaign'}</h3>
              <button onClick={() => { setIsAdding(false); setEditingCampaign(null); }} className="text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <CampaignForm 
                initialData={editingCampaign || undefined} 
                onSubmit={handleSubmit} 
                onCancel={() => { setIsAdding(false); setEditingCampaign(null); }}
                isSubmitting={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
