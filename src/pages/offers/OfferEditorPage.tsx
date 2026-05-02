import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsDocument } from '../../hooks/useCmsDocument';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { createCmsRecord, updateCmsRecord, publishCmsRecord, validateUniqueSlug } from '../../lib/cmsRepository';
import { OfferForm } from '../../components/offers/OfferForm';
import type { CmsOffer } from '../../types/cms';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function OfferEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const isNew = !id || id === 'new';
  
  const { data: offer, loading: fetchLoading, error: fetchError } = useCmsDocument<CmsOffer>(
    CMS_COLLECTIONS.offers, 
    isNew ? undefined : id
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any, isPublishing: boolean) => {
    if (!adminData) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const isUnique = await validateUniqueSlug(CMS_COLLECTIONS.offers, formData.slug, id);
      if (!isUnique) throw new Error('This slug is already in use.');

      let recordId = id;
      if (isNew) {
        recordId = await createCmsRecord(CMS_COLLECTIONS.offers, { ...formData, status: 'draft', isPublished: false }, adminData);
      } else if (recordId) {
        await updateCmsRecord(CMS_COLLECTIONS.offers, recordId, formData, adminData);
      }

      if (isPublishing && recordId) {
        await publishCmsRecord(CMS_COLLECTIONS.offers, recordId, adminData);
      }

      navigate('/offers');
    } catch (err: any) {
      setError(err.message || 'Failed to save offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading && !isNew) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  if (fetchError) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center"><AlertCircle className="w-5 h-5 mr-2" />Failed to load offer.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/offers')} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Create Offer' : 'Edit Offer'}</h1>
          <p className="text-sm text-slate-500">{isNew ? 'Add a new deal or package.' : `Editing: ${offer?.title}`}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <OfferForm initialData={offer || undefined} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
