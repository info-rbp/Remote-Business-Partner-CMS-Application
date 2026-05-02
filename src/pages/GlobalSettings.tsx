import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, Database, CreditCard, Sparkles, RefreshCw, Layers, Users, LayoutTemplate, Link as LinkIcon, Save, Settings2, Globe, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { fetchGlobalSettings, saveGlobalSettings } from '../services/globalSettingsService';
import type { CmsGlobalSettings } from '../types/cms';

type TabType = 'infrastructure' | 'tenants' | 'membership' | 'ux' | 'site';

export function GlobalSettings() {
  const { firestoreSyncStatus, setFirestoreSyncStatus } = useAppStore();
  const { adminData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('infrastructure');

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<Omit<CmsGlobalSettings, 'id' | 'updatedAt' | 'updatedBy'>>({ 
    siteName: 'RBP Hub', defaultSeoTitle: '', defaultSeoDescription: '',
    contactEmail: '', contactPhone: '', primaryCtaLabel: '', primaryCtaUrl: '',
    footerDisclosure: '', financeDisclaimer: '', affiliateDisclosure: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== 'site') return;
    setSettingsLoading(true);
    fetchGlobalSettings()
      .then(data => { if (data) setSiteSettings(data as any); })
      .catch(_err => setSettingsError('Failed to load settings.'))
      .finally(() => setSettingsLoading(false));
  }, [activeTab]);

  const handleSiteSettingChange = (field: string, value: string) => {
    setSiteSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    if (!adminData) return;
    setSettingsSaving(true);
    setSettingsError(null);
    setSettingsSaved(false);
    try {
      await saveGlobalSettings(siteSettings, adminData);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err: any) {
      setSettingsError('Failed to save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Local state for infrastructure
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);

  // Local state for Tenants (Hub Elements)
  const [hubs, setHubs] = useState([
    { id: 'on-demand-hub', name: 'On-Demand Hub', status: 'Active', domain: 'ondemand.rbphub.com' },
    { id: 'docushare', name: 'Document Nucleus', status: 'Active', domain: 'docs.rbphub.com' },
    { id: 'managed-services', name: 'Managed Services', status: 'Development', domain: 'managed.rbphub.com' },
    { id: 'business-marketplace', name: 'Business Marketplace', status: 'Active', domain: 'market.rbphub.com' },
    { id: 'operations-finance', name: 'Operations & Finance', status: 'Maintenance', domain: 'finance.rbphub.com' },
    { id: 'strategic-offers', name: 'Strategic Offers', status: 'Active', domain: 'offers.rbphub.com' },
    { id: 'knowledge-hub', name: 'Knowledge Hub', status: 'Active', domain: 'knowledge.rbphub.com' },
    { id: 'app-directory', name: 'App Directory', status: 'Active', domain: 'apps.rbphub.com' },
  ]);

  // Local state for Membership Logic
  const [plans, setPlans] = useState({
    basic: { discount: 0, tailoredCredits: 0, strategyCalls: 0 },
    pro: { discount: 10, tailoredCredits: 12, strategyCalls: 2 },
    ultimate: { discount: 20, tailoredCredits: 45, strategyCalls: 5 }
  });
  const [isDeployingConfig, setIsDeployingConfig] = useState(false);

  // Local state for UX Control
  const [footerLinks, setFooterLinks] = useState('Terms of Service\nPrivacy Policy\nSupport\nContact');
  const [affiliateDisclosure, setAffiliateDisclosure] = useState('RBP Hub may receive compensation from partners featured on the Business Insurance Hub and Partner Offers pages. This does not affect our recommendations.');

  // Handlers
  const handleRefreshInfra = async () => {
    setIsRefreshing(true);
    setFirestoreSyncStatus('syncing');
    await new Promise(resolve => setTimeout(resolve, 1200));
    setFirestoreSyncStatus('synced');
    setIsRefreshing(false);
  };

  const handleGlobalSync = async () => {
    setIsSyncingGlobal(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncingGlobal(false);
  };

  const handleDeployConfig = async () => {
    setIsDeployingConfig(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsDeployingConfig(false);
  };

  const handleHubChange = (id: string, field: 'status' | 'domain', value: string) => {
    setHubs(hubs.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const handlePlanChange = (tier: 'basic' | 'pro' | 'ultimate', field: string, value: number) => {
    setPlans({
      ...plans,
      [tier]: { ...plans[tier], [field]: value }
    });
  };

  const tabs = [
    { id: 'infrastructure', name: 'Infrastructure', icon: Activity },
    { id: 'tenants', name: 'Tenant Hubs', icon: Layers },
    { id: 'membership', name: 'Memberships', icon: Users },
    { id: 'ux', name: 'Global UX', icon: LayoutTemplate },
    { id: 'site', name: 'Site Settings', icon: Settings2 },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Multi-Tenant Orchestration</h1>
        <p className="text-slate-500 mt-1">Manage global configuration, tenants, and infrastructure.</p>
      </div>

      <div className="flex border-b border-slate-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center px-6 py-3 border-b-2 text-sm font-medium transition-colors",
                isActive 
                  ? "border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="py-2">
        {activeTab === 'infrastructure' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-slate-900" />
                  API Services Monitor
                </CardTitle>
                <button 
                  onClick={handleRefreshInfra}
                  disabled={isRefreshing}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Status
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Firestore Database', desc: 'Real-time sync and storage', icon: Database, color: 'text-orange-500', status: firestoreSyncStatus === 'synced' ? 'Operational' : 'Checking...' },
                  { name: 'Stripe Payments', desc: 'Billing and subscriptions', icon: CreditCard, color: 'text-indigo-500', status: isRefreshing ? 'Checking...' : 'Operational' },
                  { name: 'Gemini AI', desc: 'Document analysis & suggestions', icon: Sparkles, color: 'text-emerald-500', status: isRefreshing ? 'Checking...' : 'Operational' },
                  { name: 'Notion API', desc: 'Service Offering syncs', icon: FileText, color: 'text-slate-700', status: isRefreshing ? 'Checking...' : 'Operational' },
                  { name: 'Square Catalog API', desc: 'Product and inventory sync', icon: Settings2, color: 'text-stone-500', status: isRefreshing ? 'Checking...' : 'Operational' },
                ].map((api, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center">
                      <api.icon className={`w-5 h-5 ${api.color} mr-3`} />
                      <div>
                        <h4 className="font-medium text-slate-900">{api.name}</h4>
                        <p className="text-xs text-slate-500">{api.desc}</p>
                      </div>
                    </div>
                    <Badge variant={api.status === 'Operational' ? "active" : "draft"}>
                      {api.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-slate-900" />
                  Global Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Force Global Sync</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Initiates <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">syncSquareCatalog</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">syncNotionServices</code> functions across all relevant apps.
                    </p>
                  </div>
                  <button 
                    onClick={handleGlobalSync}
                    disabled={isSyncingGlobal}
                    className="w-full flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isSyncingGlobal ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    {isSyncingGlobal ? 'Syncing Ecosystem...' : 'Trigger Global Sync'}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tenants' && (
          <Card>
            <CardHeader>
              <CardTitle>Hub Elements Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Core App</th>
                      <th className="px-4 py-3 font-medium">Domain Mapping</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hubs.map(hub => (
                      <tr key={hub.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-4 font-medium text-slate-900">{hub.name}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 text-slate-400 mr-2" />
                            <input 
                              type="text" 
                              value={hub.domain}
                              onChange={(e) => handleHubChange(hub.id, 'domain', e.target.value)}
                              className="w-full max-w-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-slate-700"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select 
                            value={hub.status}
                            onChange={(e) => handleHubChange(hub.id, 'status', e.target.value)}
                            className={cn(
                              "px-3 py-1.5 border rounded-lg text-sm font-medium focus:ring-2 outline-none",
                              hub.status === 'Active' ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                              hub.status === 'Development' ? "bg-blue-50 border-blue-200 text-blue-700" :
                              "bg-amber-50 border-amber-200 text-amber-700"
                            )}
                          >
                            <option value="Active">Active</option>
                            <option value="Development">Development</option>
                            <option value="Maintenance">Maintenance</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'membership' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">PLAN_PRESETS Editor</h3>
                <p className="text-sm text-slate-500">Configure global entitlements for all subscription tiers.</p>
              </div>
              <button 
                onClick={handleDeployConfig}
                disabled={isDeployingConfig}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
              >
                {isDeployingConfig ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isDeployingConfig ? 'Deploying...' : 'Deploy Membership Config'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['basic', 'pro', 'ultimate'] as const).map(tier => (
                <Card key={tier}>
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="capitalize">{tier} Tier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Discount %</label>
                      <input 
                        type="number" 
                        value={plans[tier].discount}
                        onChange={(e) => handlePlanChange(tier, 'discount', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tailored Credits (Annual)</label>
                      <input 
                        type="number" 
                        value={plans[tier].tailoredCredits}
                        onChange={(e) => handlePlanChange(tier, 'tailoredCredits', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Strategy Calls (Annual)</label>
                      <input 
                        type="number" 
                        value={plans[tier].strategyCalls}
                        onChange={(e) => handlePlanChange(tier, 'strategyCalls', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ux' && (
          <Card>
            <CardHeader>
              <CardTitle>Platform Footer Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2" /> Shared Links
                  </label>
                  <textarea 
                    rows={6}
                    value={footerLinks}
                    onChange={(e) => setFooterLinks(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none resize-none text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-2">One link per line. Propagates to all 8 hubs.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Affiliate Disclosures
                  </label>
                  <textarea 
                    rows={6}
                    value={affiliateDisclosure}
                    onChange={(e) => setAffiliateDisclosure(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none resize-none text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-2">Legal text for Business Insurance Hub and Partner Offers.</p>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save UX Changes
                </button>
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'site' && (
          <div className="space-y-6">
            {settingsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : (
              <>
                {settingsError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {settingsError}
                  </div>
                )}
                {settingsSaved && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center text-emerald-700 text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" /> Settings saved to Firestore.
                  </div>
                )}

                {/* Core Identity */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Globe className="w-5 h-5 mr-2 text-slate-900" />Core Site Identity</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { field: 'siteName', label: 'Site Name' },
                        { field: 'contactEmail', label: 'Contact Email' },
                        { field: 'contactPhone', label: 'Contact Phone' },
                        { field: 'primaryCtaLabel', label: 'Primary CTA Label' },
                        { field: 'primaryCtaUrl', label: 'Primary CTA URL' },
                      ].map(({ field, label }) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                          <input
                            value={(siteSettings as any)[field] || ''}
                            onChange={(e) => handleSiteSettingChange(field, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Default SEO */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2 text-slate-900" />Default SEO</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default SEO Title</label>
                      <input value={siteSettings.defaultSeoTitle || ''}
                        onChange={(e) => handleSiteSettingChange('defaultSeoTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default SEO Description</label>
                      <textarea rows={3} value={siteSettings.defaultSeoDescription || ''}
                        onChange={(e) => handleSiteSettingChange('defaultSeoDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
                    </div>
                  </CardContent>
                </Card>

                {/* Legal Disclosures */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2 text-slate-900" />Legal Disclosures</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { field: 'footerDisclosure', label: 'Footer Disclosure' },
                      { field: 'financeDisclaimer', label: 'Finance Disclaimer' },
                      { field: 'affiliateDisclosure', label: 'Affiliate Disclosure' },
                    ].map(({ field, label }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                        <textarea rows={3} value={(siteSettings as any)[field] || ''}
                          onChange={(e) => handleSiteSettingChange(field, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Save */}
                <div className="flex justify-end">
                  <button onClick={handleSaveSettings} disabled={settingsSaving}
                    className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
                    {settingsSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {settingsSaving ? 'Saving...' : 'Save to Firestore'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
