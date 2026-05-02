import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsDocument } from '../../hooks/useCmsDocument';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { createCmsRecord, updateCmsRecord, publishCmsRecord, validateUniqueSlug } from '../../lib/cmsRepository';
import { ResourceForm } from '../../components/resources/ResourceForm';
import type { CmsResource } from '../../types/cms';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function ResourceEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const isNew = !id || id === 'new';
  
  const { data: resource, loading: fetchLoading, error: fetchError } = useCmsDocument<CmsResource>(
    CMS_COLLECTIONS.resources, 
    isNew ? undefined : id
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any, isPublishing: boolean) => {
    if (!adminData) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate unique slug
      const isUnique = await validateUniqueSlug(CMS_COLLECTIONS.resources, formData.slug, id);
      if (!isUnique) {
        throw new Error('This slug is already in use. Please choose a different one.');
      }

      let recordId = id;

      if (isNew) {
        // Create as draft first
        recordId = await createCmsRecord(CMS_COLLECTIONS.resources, { ...formData, status: 'draft', isPublished: false }, adminData);
      } else if (recordId) {
        // Update existing
        await updateCmsRecord(CMS_COLLECTIONS.resources, recordId, formData, adminData);
      }

      if (isPublishing && recordId) {
        await publishCmsRecord(CMS_COLLECTIONS.resources, recordId, adminData);
      }

      navigate('/resources');
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || 'Failed to save resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading && !isNew) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed to load resource.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/resources')}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isNew ? 'Create Resource' : 'Edit Resource'}
          </h1>
          <p className="text-sm text-slate-500">
            {isNew ? 'Draft a new resource for the public site.' : `Editing: ${resource?.title}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <ResourceForm 
        initialData={resource || undefined}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
