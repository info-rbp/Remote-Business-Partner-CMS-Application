import React, { useState } from 'react';
import type { CmsCampaign } from '../../types/cms';
import { generateSlug } from '../../utils/slug';

type CampaignFormData = Omit<CmsCampaign, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'publishedAt' | 'publishedBy' | 'archivedAt' | 'archivedBy' | 'isPublished'>;

interface CampaignFormProps {
  initialData?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData, isPublishing: boolean) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CampaignForm({ initialData, onSubmit, onCancel, isSubmitting }: CampaignFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    status: initialData?.status || 'draft',
    campaignType: initialData?.campaignType || 'banner',
    placement: initialData?.placement || 'header-top',
    content: initialData?.content || '',
    ctaLabel: initialData?.ctaLabel || '',
    ctaUrl: initialData?.ctaUrl || '',
    backgroundColor: initialData?.backgroundColor || '#1e293b',
    textColor: initialData?.textColor || '#ffffff',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    priority: initialData?.priority || 0,
    tags: initialData?.tags || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      slug: name === 'title' && !initialData?.slug ? generateSlug(value) : prev.slug
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input name="slug" value={formData.slug} onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select name="campaignType" value={formData.campaignType} onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white">
            <option value="banner">Banner</option>
            <option value="modal">Modal</option>
            <option value="toast">Toast</option>
            <option value="overlay">Overlay</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Placement</label>
          <select name="placement" value={formData.placement} onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white">
            <option value="header-top">Header Top</option>
            <option value="footer-bottom">Footer Bottom</option>
            <option value="global-sidebar">Global Sidebar</option>
            <option value="specific-page">Specific Page</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Content / Message *</label>
        <textarea name="content" value={formData.content} onChange={handleChange} rows={3} required
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none resize-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">CTA Label</label>
          <input name="ctaLabel" value={formData.ctaLabel} onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">CTA URL</label>
          <input name="ctaUrl" value={formData.ctaUrl} onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
          <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange}
            className="w-full h-10 border border-slate-200 rounded-xl cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
          <input type="color" name="textColor" value={formData.textColor} onChange={handleChange}
            className="w-full h-10 border border-slate-200 rounded-xl cursor-pointer" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Cancel
        </button>
        <button type="button" onClick={() => onSubmit(formData, false)} disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50">
          Save Draft
        </button>
        <button type="button" onClick={() => onSubmit(formData, true)} disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Publish Now'}
        </button>
      </div>
    </div>
  );
}
