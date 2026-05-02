import React, { useState, useEffect } from 'react';
import type { CmsOffer } from '../../types/cms';
import { generateSlug } from '../../utils/slug';
import { validateRequired } from '../../utils/cmsValidation';

type OfferFormData = Omit<CmsOffer, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'publishedAt' | 'publishedBy' | 'archivedAt' | 'archivedBy' | 'isPublished'>;

interface OfferFormProps {
  initialData?: Partial<OfferFormData>;
  onSubmit: (data: OfferFormData, isPublishing: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export function OfferForm({ initialData, onSubmit, isSubmitting }: OfferFormProps) {
  const [formData, setFormData] = useState<OfferFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    status: initialData?.status || 'draft',
    offerType: initialData?.offerType || 'partner-deal',
    badge: initialData?.badge || '',
    priceLabel: initialData?.priceLabel || '',
    durationLabel: initialData?.durationLabel || '',
    excerpt: initialData?.excerpt || '',
    body: initialData?.body || '',
    inclusions: initialData?.inclusions || [],
    partnerName: initialData?.partnerName || '',
    partnerLogoUrl: initialData?.partnerLogoUrl || '',
    category: initialData?.category || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    ctaLabel: initialData?.ctaLabel || '',
    ctaUrl: initialData?.ctaUrl || '',
    terms: initialData?.terms || '',
    disclosure: initialData?.disclosure || '',
    featured: initialData?.featured || false,
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inclusionInput, setInclusionInput] = useState('');

  useEffect(() => {
    if (!initialData?.slug && formData.title && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
    if (!initialData?.seoTitle && formData.title && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: formData.title }));
    }
  }, [formData.title, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddInclusion = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inclusionInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({ ...prev, inclusions: [...(prev.inclusions || []), inclusionInput.trim()] }));
      setInclusionInput('');
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData(prev => ({ ...prev, inclusions: prev.inclusions?.filter((_, i) => i !== index) }));
  };

  const validateForm = (isPublishing: boolean): boolean => {
    const newErrors: Record<string, string> = {};

    const reqTitle = validateRequired(formData.title, 'Title');
    if (reqTitle) newErrors.title = reqTitle;
    
    const reqSlug = validateRequired(formData.slug, 'Slug');
    if (reqSlug) newErrors.slug = reqSlug;

    if (isPublishing) {
      if (!formData.excerpt) newErrors.excerpt = 'Excerpt is required for publishing.';
      if (!formData.ctaLabel) newErrors.ctaLabel = 'CTA Label is required for publishing.';
      if (!formData.ctaUrl) newErrors.ctaUrl = 'CTA URL is required for publishing.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, isPublishing: boolean) => {
    e.preventDefault();
    if (validateForm(isPublishing)) {
      onSubmit(formData, isPublishing);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Offer Identity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input 
              name="title" value={formData.title} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
            <input 
              name="slug" value={formData.slug} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.slug ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Offer Type</label>
            <select 
              name="offerType" value={formData.offerType} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="advisory-package">Advisory Package</option>
              <option value="partner-deal">Partner Deal</option>
              <option value="membership-offer">Membership Offer</option>
              <option value="service-package">Service Package</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input 
              name="category" value={formData.category} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Badge (e.g. "Limited Time")</label>
            <input 
              name="badge" value={formData.badge} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
        </div>
      </div>

      {/* Pricing & Partners */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Pricing & Partner Info</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price Label (e.g. "Free", "£99/mo")</label>
            <input 
              name="priceLabel" value={formData.priceLabel} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration Label (e.g. "6 Months")</label>
            <input 
              name="durationLabel" value={formData.durationLabel} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name</label>
            <input 
              name="partnerName" value={formData.partnerName} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Partner Logo URL</label>
            <input 
              name="partnerLogoUrl" value={formData.partnerLogoUrl} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Offer Content</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt *</label>
          <textarea 
            name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2}
            className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.excerpt ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
          />
          {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Inclusions</label>
          <div className="space-y-2 mb-2">
            {formData.inclusions?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg group">
                <span className="text-sm text-slate-700">{item}</span>
                <button type="button" onClick={() => handleRemoveInclusion(idx)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input 
            type="text" value={inclusionInput} onChange={(e) => setInclusionInput(e.target.value)} onKeyDown={handleAddInclusion}
            placeholder="Type an inclusion and press Enter"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA Label *</label>
            <input 
              name="ctaLabel" value={formData.ctaLabel} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.ctaLabel ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.ctaLabel && <p className="text-red-500 text-xs mt-1">{errors.ctaLabel}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA URL *</label>
            <input 
              name="ctaUrl" value={formData.ctaUrl} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.ctaUrl ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.ctaUrl && <p className="text-red-500 text-xs mt-1">{errors.ctaUrl}</p>}
          </div>
        </div>
      </div>

      {/* Disclosures & Terms */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Legal & Terms</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Offer Disclosure</label>
          <textarea 
            name="disclosure" value={formData.disclosure} onChange={handleChange} rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Terms & Conditions</label>
          <textarea 
            name="terms" value={formData.terms} onChange={handleChange} rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm" 
          />
        </div>

        <div className="flex items-center mt-2">
          <input 
            type="checkbox" name="featured" id="featured"
            checked={formData.featured} onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-slate-700">
            Feature this offer
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting}
          className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Publish Offer'}
        </button>
      </div>
    </form>
  );
}
