import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCmsDocument } from '../../hooks/useCmsDocument';
import { CMS_COLLECTIONS } from '../../lib/cmsCollections';
import { createCmsRecord, updateCmsRecord, publishCmsRecord, validateUniqueSlug } from '../../lib/cmsRepository';
import type { CmsNavigationItem } from '../../types/cms';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { generateSlug } from '../../utils/slug';

type NavFormData = Omit<CmsNavigationItem, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'archivedAt' | 'createdBy' | 'updatedBy' | 'publishedBy' | 'archivedBy' | 'isPublished'>;

export function NavEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const isNew = !id || id === 'new';

  const { data: navItem, loading: fetchLoading } = useCmsDocument<CmsNavigationItem>(
    CMS_COLLECTIONS.navigation,
    isNew ? undefined : id
  );

  const [form, setForm] = useState<NavFormData>({
    title: navItem?.title || '',
    slug: navItem?.slug || '',
    label: navItem?.label || '',
    href: navItem?.href || '',
    navArea: navItem?.navArea || 'header',
    group: navItem?.group || '',
    parentId: navItem?.parentId || '',
    description: navItem?.description || '',
    iconKey: navItem?.iconKey || '',
    isExternal: navItem?.isExternal || false,
    openInNewTab: navItem?.openInNewTab || false,
    sortOrder: navItem?.sortOrder || 0,
    status: navItem?.status || 'draft',
    tags: navItem?.tags || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent, isPublishing: boolean) => {
    e.preventDefault();
    if (!adminData) return;
    if (!form.label.trim()) { setError('Label is required.'); return; }
    if (!form.href.trim()) { setError('URL/href is required.'); return; }

    setIsSubmitting(true);
    setError(null);

    const slug = form.slug || generateSlug(form.label);
    const data = { ...form, slug, title: form.label };

    try {
      const isUnique = await validateUniqueSlug(CMS_COLLECTIONS.navigation, slug, id);
      if (!isUnique) throw new Error('This slug is already in use.');

      let recordId = id;
      if (isNew) {
        recordId = await createCmsRecord(CMS_COLLECTIONS.navigation, { ...data, status: 'draft', isPublished: false }, adminData);
      } else if (recordId) {
        await updateCmsRecord(CMS_COLLECTIONS.navigation, recordId, data, adminData);
      }
      if (isPublishing && recordId) {
        await publishCmsRecord(CMS_COLLECTIONS.navigation, recordId, adminData);
      }
      navigate('/navigation');
    } catch (err: any) {
      setError(err.message || 'Failed to save.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchLoading && !isNew) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/navigation')} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'Create Nav Item' : 'Edit Nav Item'}</h1>
          <p className="text-sm text-slate-500">Manage header, footer, and mobile navigation links.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start text-sm">
          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Link Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Label *</label>
              <input name="label" value={form.label} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL / href *</label>
              <input name="href" value={form.href} onChange={handleChange} placeholder="/page or https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nav Area</label>
              <select name="navArea" value={form.navArea} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="mobile">Mobile</option>
                <option value="utility">Utility</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Group / Column</label>
              <input name="group" value={form.group} onChange={handleChange} placeholder="e.g. Services, Company"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
              <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated if blank"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input name="description" value={form.description} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" name="isExternal" checked={form.isExternal} onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300" />
              External link
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" name="openInNewTab" checked={form.openInNewTab} onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300" />
              Open in new tab
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={isSubmitting}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
            Save as Draft
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Publish Nav Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
