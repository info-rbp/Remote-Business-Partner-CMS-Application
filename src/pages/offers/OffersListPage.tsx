import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { archiveCmsRecord, publishCmsRecord, restoreCmsRecord } from '../../lib/cmsRepository';
import type { CmsOffer } from '../../types/cms';
import { Plus, Search, FileEdit, Globe, Archive, Loader2, RefreshCw, Gift } from 'lucide-react';
import { useState } from 'react';

export function OffersListPage() {
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const { data: offers, loading, refetch } = useCmsCollection<CmsOffer>(CMS_COLLECTIONS.offers);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          offer.partnerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || offer.offerType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handlePublish = async (id: string) => {
    if (!adminData || !window.confirm('Publish this offer?')) return;
    await publishCmsRecord(CMS_COLLECTIONS.offers, id, adminData);
    refetch();
  };

  const handleArchive = async (id: string) => {
    if (!adminData || !window.confirm('Archive this offer?')) return;
    await archiveCmsRecord(CMS_COLLECTIONS.offers, id, adminData);
    refetch();
  };

  const handleRestore = async (id: string) => {
    if (!adminData) return;
    await restoreCmsRecord(CMS_COLLECTIONS.offers, id, adminData);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Offers Manager</h1>
          <p className="text-sm text-slate-500">Manage partner deals, advisory packages, and membership offers.</p>
        </div>
        <button
          onClick={() => navigate('/offers/new')}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search offers by title or partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        >
          <option value="all">All Types</option>
          <option value="advisory-package">Advisory Package</option>
          <option value="partner-deal">Partner Deal</option>
          <option value="membership-offer">Membership Offer</option>
          <option value="service-package">Service Package</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : filteredOffers.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Gift className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            No offers found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{offer.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${offer.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        offer.status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                      {offer.status}
                    </span>
                    {offer.featured && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Featured</span>}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 space-x-3">
                    <span className="capitalize">{offer.offerType.replace('-', ' ')}</span>
                    {offer.partnerName && (
                      <>
                        <span>&bull;</span>
                        <span className="truncate">{offer.partnerName}</span>
                      </>
                    )}
                    {offer.priceLabel && (
                      <>
                        <span>&bull;</span>
                        <span className="truncate font-medium text-slate-700">{offer.priceLabel}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button onClick={() => navigate(`/offers/${offer.id}/edit`)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FileEdit className="w-4 h-4" />
                  </button>
                  {offer.status !== 'published' && offer.status !== 'archived' && (
                    <button onClick={() => handlePublish(offer.id!)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Globe className="w-4 h-4" />
                    </button>
                  )}
                  {offer.status !== 'archived' ? (
                    <button onClick={() => handleArchive(offer.id!)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Archive className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => handleRestore(offer.id!)}
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
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
