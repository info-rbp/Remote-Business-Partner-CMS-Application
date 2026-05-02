export const CMS_COLLECTIONS = {
  resources: 'cms_resources',
  navigation: 'cms_navigation',
  globalSettings: 'cms_global_settings',
  offers: 'cms_offers',
  mediaAssets: 'cms_media_assets',
  documentProducts: 'cms_document_products',
  leadEnquiries: 'cms_lead_enquiries',
  auditLogs: 'cms_audit_logs',
} as const;

export type CmsCollectionName = typeof CMS_COLLECTIONS[keyof typeof CMS_COLLECTIONS];
