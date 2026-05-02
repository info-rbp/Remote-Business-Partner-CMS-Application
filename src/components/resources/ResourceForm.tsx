import React, { useState, useEffect } from 'react';
import type { CmsResource } from '../../types/cms';
import { generateSlug } from '../../utils/slug';
import { validateRequired } from '../../utils/cmsValidation';

type ResourceFormData = Omit<CmsResource, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'publishedAt' | 'publishedBy' | 'archivedAt' | 'archivedBy' | 'isPublished'>;

interface ResourceFormProps {
  initialData?: Partial<ResourceFormData>;
  onSubmit: (data: ResourceFormData, isPublishing: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export function ResourceForm({ initialData, onSubmit, isSubmitting }: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    status: initialData?.status || 'draft',
    resourceType: initialData?.resourceType || 'guide',
    category: initialData?.category || '',
    excerpt: initialData?.excerpt || '',
    body: initialData?.body || '',
    featured: initialData?.featured || false,
    readTime: initialData?.readTime || '',
    imageUrl: initialData?.imageUrl || '',
    imageAlt: initialData?.imageAlt || '',
    downloadUrl: initialData?.downloadUrl || '',
    ctaLabel: initialData?.ctaLabel || '',
    ctaUrl: initialData?.ctaUrl || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  // Auto-generate slug and SEO title if empty
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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
  };

  const validateForm = (isPublishing: boolean): boolean => {
    const newErrors: Record<string, string> = {};

    const reqTitle = validateRequired(formData.title, 'Title');
    if (reqTitle) newErrors.title = reqTitle;
    
    const reqSlug = validateRequired(formData.slug, 'Slug');
    if (reqSlug) newErrors.slug = reqSlug;

    if (isPublishing) {
      if (!formData.category) newErrors.category = 'Category is required for publishing.';
      if (!formData.excerpt) newErrors.excerpt = 'Excerpt is required for publishing.';
      if (!formData.seoTitle) newErrors.seoTitle = 'SEO Title is required for publishing.';
      if (!formData.seoDescription) newErrors.seoDescription = 'SEO Description is required for publishing.';
      if (formData.imageUrl && !formData.imageAlt) newErrors.imageAlt = 'Image Alt Text is required if Image URL is provided.';
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
        <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resource Type</label>
            <select 
              name="resourceType" value={formData.resourceType} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="guide">Guide</option>
              <option value="template">Template</option>
              <option value="video">Video</option>
              <option value="download">Download</option>
              <option value="case-study">Case Study</option>
              <option value="market-intelligence">Market Intelligence</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input 
              name="category" value={formData.category} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.category ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
          <textarea 
            name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2}
            className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.excerpt ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
          />
          {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Body Content</label>
          <textarea 
            name="body" value={formData.body} onChange={handleChange} rows={8}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm" 
            placeholder="Markdown supported"
          />
        </div>
      </div>

      {/* Media & Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Media & Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
            <input 
              name="imageUrl" value={formData.imageUrl} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image Alt Text</label>
            <input 
              name="imageAlt" value={formData.imageAlt} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.imageAlt ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.imageAlt && <p className="text-red-500 text-xs mt-1">{errors.imageAlt}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Download URL</label>
            <input 
              name="downloadUrl" value={formData.downloadUrl} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Read Time (e.g. "5 min")</label>
            <input 
              name="readTime" value={formData.readTime} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900" 
            />
          </div>
        </div>

        <div className="flex items-center mt-2">
          <input 
            type="checkbox" name="featured" id="featured"
            checked={formData.featured} onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-slate-700">
            Feature this resource
          </label>
        </div>
      </div>

      {/* SEO & Tags */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">SEO & Classification</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
            <input 
              name="seoTitle" value={formData.seoTitle} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.seoTitle ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.seoTitle && <p className="text-red-500 text-xs mt-1">{errors.seoTitle}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
            <input 
              name="seoDescription" value={formData.seoDescription} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 ${errors.seoDescription ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-900'}`} 
            />
            {errors.seoDescription && <p className="text-red-500 text-xs mt-1">{errors.seoDescription}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags?.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-slate-400 hover:text-slate-600">&times;</button>
              </span>
            ))}
          </div>
          <input 
            type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm" 
          />
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
          {isSubmitting ? 'Saving...' : 'Publish Resource'}
        </button>
      </div>
    </form>
  );
}
