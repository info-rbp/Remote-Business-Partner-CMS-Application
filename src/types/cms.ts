export type CmsStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'archived';

export interface CmsBaseRecord {
  id?: string;
  title: string;
  slug: string;
  status: CmsStatus;
  isPublished: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  publishedAt?: unknown;
  archivedAt?: unknown;
  createdBy?: string;
  updatedBy?: string;
  publishedBy?: string;
  archivedBy?: string;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

export interface CmsResource extends CmsBaseRecord {
  resourceType: 'guide' | 'template' | 'video' | 'download' | 'case-study' | 'market-intelligence';
  category: string;
  excerpt: string;
  body?: string;
  featured?: boolean;
  readTime?: string;
  imageUrl?: string;
  imageAlt?: string;
  downloadUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  relatedResourceIds?: string[];
}

export interface CmsNavigationItem extends CmsBaseRecord {
  label: string;
  href: string;
  navArea: 'header' | 'footer' | 'mobile' | 'utility';
  group?: string;
  parentId?: string;
  description?: string;
  iconKey?: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
}

export interface CmsGlobalSettings {
  id?: string;
  siteName: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  footerDisclosure?: string;
  financeDisclaimer?: string;
  affiliateDisclosure?: string;
  updatedAt?: unknown;
  updatedBy?: string;
}

export interface CmsOffer extends CmsBaseRecord {
  offerType: 'advisory-package' | 'partner-deal' | 'membership-offer' | 'service-package';
  badge?: string;
  priceLabel?: string;
  durationLabel?: string;
  excerpt: string;
  body?: string;
  inclusions?: string[];
  partnerName?: string;
  partnerLogoUrl?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  terms?: string;
  disclosure?: string;
  featured?: boolean;
}

export interface CmsDocumentProduct extends CmsBaseRecord {
  productType: 'template' | 'toolkit' | 'documentation-suite';
  category: string;
  excerpt: string;
  body?: string;
  priceLabel?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  deliveryFormat?: string;
  turnaroundTime?: string;
  requiresQuestionnaire?: boolean;
  requiredInputs?: string[];
  sampleUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  relatedProductIds?: string[];
}

export interface CmsLeadEnquiry extends Omit<CmsBaseRecord, 'status'> {
  enquiryType: 'contact' | 'finance' | 'decision-desk' | 'document' | 'service' | 'membership' | 'marketplace';
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  sourcePath?: string;
  status: CmsStatus | 'new' | 'in-progress' | 'closed';
  assignedTo?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  internalNotes?: string;
}

export interface CmsAuditLog {
  id?: string;
  collectionName: string;
  recordId: string;
  action: 'create' | 'update' | 'publish' | 'archive' | 'restore' | 'delete';
  actorId?: string;
  actorEmail?: string;
  timestamp?: unknown;
  summary?: string;
}
