# RBP CMS Implementation Document for Google Antigravity

## Document purpose

This document is intended to be uploaded into Google Antigravity as the implementation brief for the Remote Business Partner CMS build.

The goal is to turn the CMS from an admin shell into a working operational control layer for the public website. The CMS must manage real content, navigation, offers, SEO, media, enquiries, products, publishing status, and dashboard alerts without requiring code changes every time website content changes.

The implementation must be incremental, safe, and testable. Do not try to build every possible CMS feature in one heroic sprint. That is how software turns into decorative rubble.

---

## Repositories and live site

### Public website repository

Repository:

```text
info-rbp/Uiuxdesignassistance
```

Live testing URL:

```text
https://main-website-testing-ground.delicate-dream-e4c9.workers.dev/
```

Observed public website architecture:

- Vite React application.
- Uses React Router through `RouterProvider`.
- Main router is located at `src/app/routes.tsx`.
- Main app entry is located at `src/app/App.tsx`.
- Major pages currently include Home, About, Contact, Help, On-Demand Services, Managed Services, Applications, Marketplace, Membership, Resources, Operations, Finance, Offers, DocuShare, Decision Desk, and Document Nucleus routes.
- Header navigation is currently hardcoded in `src/app/components/Navbar.tsx`.
- Footer navigation and contact details are currently hardcoded in `src/app/components/Footer.tsx`.
- Resources, Offers, and Finance pages currently use local static arrays and component-level content.

### CMS repository

Repository:

```text
info-rbp/Remote-Business-Partner-CMS-Application
```

Observed CMS architecture:

- Vite React TypeScript application.
- Uses React Router DOM.
- Uses Tailwind CSS.
- Uses Zustand for local UI state.
- Current routes include:
  - `/`
  - `/users`
  - `/campaigns`
  - `/settings`
- Current layout shell includes a sidebar, main content region, and status bar.
- Current sidebar maps to major project hubs:
  - On-Demand Hub
  - Document Nucleus
  - Managed Services
  - Business Marketplace
  - Operations and Finance
  - Strategic Offers
  - Knowledge Hub
  - App Directory
- Current settings page includes local UI concepts for infrastructure, tenant hubs, membership settings, and global UX, but these are not yet persisted to a live content store.

---

## Primary objective

Build the first production-ready CMS capability layer for the RBP website.

The CMS must eventually manage the following high-priority capabilities:

1. Resources Manager
2. Navigation and Footer Manager
3. Global Settings Manager
4. Offers Manager
5. SEO Cockpit
6. Media Library
7. Publishing Workflow
8. Lead and Enquiry Manager
9. Document Product Manager
10. Dashboard with Needs Attention alerts

The first implementation should focus on creating the shared CMS foundation and proving one complete end-to-end loop:

```text
CMS creates or edits content
CMS stores content in Firestore
CMS publishes content
Public website reads only published content
Public website displays updated content without a code deployment
```

The first full loop should be implemented using the Resources Manager.

---

## Non-negotiable implementation principles

1. Preserve the existing stack.
   - Do not migrate frameworks.
   - Do not replace React Router unless absolutely required.
   - Do not replace the current design system or styling approach.

2. Work in safe phases.
   - Inspect both repositories first.
   - Produce a short implementation plan before editing.
   - Make changes in logical batches.
   - Keep public website fallback content during migration.

3. Keep CMS concerns separate from billing and fulfilment.
   - CMS may manage display content, product metadata, and Stripe mapping fields.
   - CMS must not implement payment fulfilment in this phase.
   - CMS must not implement complex business workflows in this phase.

4. Public website safety.
   - Draft content must never appear publicly.
   - Archived content must never appear publicly.
   - Public pages must handle loading, empty, and error states.
   - Public pages should have fallback static content while CMS integration is incomplete.

5. Admin safety.
   - CMS routes must be protected by authentication.
   - Admin permissions must be role-aware.
   - All create, update, publish, and archive actions must be audit logged.

6. Content model discipline.
   - Use typed CMS records.
   - Use reusable base fields across all publishable collections.
   - Avoid duplicating schemas in multiple places.
   - Avoid hardcoding new production content in React components.

---

## Target architecture

Implement this architecture:

```text
Notion or planning docs
        |
        v
CMS Admin App
        |
        v
Firestore CMS Collections
        |
        v
Public Website
        |
        v
Published Website Content
```

In this architecture:

- Notion can remain a planning and drafting layer.
- The CMS is the publishing and operational control layer.
- Firestore is the live content store.
- The public website reads published content from Firestore.
- The public website does not read drafts, review items, or archived records.

---

## Phase 0: Repository inspection and implementation plan

Before writing code, inspect both repositories.

### Public website inspection checklist

Inspect:

```text
package.json
src/app/App.tsx
src/app/routes.tsx
src/app/components/Navbar.tsx
src/app/components/Footer.tsx
src/app/pages/ResourcesPage.tsx
src/app/pages/OffersPage.tsx
src/app/pages/FinancePage.tsx
src/app/pages/DocuSharePage.tsx
src/app/pages/DocumentOverviewPage.tsx
src/app/pages/DocumentCategoryPage.tsx
src/app/pages/DocumentProductPage.tsx
```

Confirm:

- Routing approach.
- Component structure.
- Styling approach.
- Current hardcoded content areas.
- Existing page imports and route paths.
- Existing shared components that should be reused.

### CMS inspection checklist

Inspect:

```text
package.json
src/App.tsx
src/components/layout/AppLayout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/GlobalStatusBar.tsx
src/store/useAppStore.ts
src/pages/Dashboard.tsx
src/pages/UsersMembership.tsx
src/pages/CampaignsSEO.tsx
src/pages/GlobalSettings.tsx
src/components/ui/*
```

Confirm:

- Routing approach.
- Existing UI components.
- Existing layout shell.
- Existing Zustand store shape.
- Existing pages and placeholder behavior.
- Whether Firebase dependencies already exist.
- Whether any deployment config already exists.

### Required output before coding

Before editing, provide a short plan with:

- detected framework and router in each repo
- detected styling approach
- files likely to be created
- files likely to be modified
- implementation phases
- risks or assumptions

---

## Phase 1: CMS foundation

### Goal

Create the shared technical foundation that allows the CMS and public website to communicate through Firestore safely.

### Required work in both repositories

Add Firebase client setup.

Create:

```text
src/lib/firebase.ts
src/types/cms.ts
```

If a shared package is not practical yet, duplicate the same typed shape carefully in both repos for now and document the duplication.

### Required environment variables

Use Vite environment variables.

Add example environment file:

```text
.env.example
```

Include:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Firebase setup file

Create a Firebase helper that exports:

```ts
app
auth
db
storage
```

Only export `storage` if Firebase Storage is added during this phase. If Media Library is deferred, keep the file ready for storage but do not over-implement.

### CMS shared types

Create typed CMS models.

Required base types:

```ts
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
```

Add collection-specific types:

```ts
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

export interface CmsLeadEnquiry extends CmsBaseRecord {
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
```

Adjust exact field names as required by existing code style, but keep the intent and common model stable.

---

## Phase 2: Authentication and route protection in CMS

### Goal

Make the CMS private and role-aware.

### Required CMS files

Create or update:

```text
src/pages/LoginPage.tsx
src/components/auth/ProtectedRoute.tsx
src/components/auth/AuthProvider.tsx
src/hooks/useAuth.ts
src/lib/auth.ts
src/types/auth.ts
```

### Required behavior

- Unauthenticated users must be redirected to `/login`.
- Authenticated users may access CMS routes only if they have an approved CMS role.
- `/login` must not use the full admin layout.
- The CMS must support logout.
- The current user identity must be available to audit logging.

### Role model

Use a Firestore collection such as:

```text
cms_admin_users
```

Fields:

```ts
{
  uid: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Permission expectations

- owner: full access
- admin: manage all CMS content and settings
- editor: create and edit content, submit for review
- reviewer: approve and publish content
- viewer: read-only access

Do not build a complex permission UI yet. Implement enough role checking to protect routes and actions.

---

## Phase 3: Firestore CMS helpers and audit logging

### Goal

Create reusable CMS data helpers so each future module can use the same create, update, publish, archive, and list pattern.

### CMS files to create

```text
src/lib/cmsCollections.ts
src/lib/cmsRepository.ts
src/lib/auditLog.ts
src/hooks/useCmsCollection.ts
src/hooks/useCmsDocument.ts
src/utils/slug.ts
src/utils/cmsValidation.ts
```

### Required collection constants

```ts
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
```

### Required CMS repository helpers

Implement typed helpers:

```ts
createCmsRecord(collectionName, data, actor)
updateCmsRecord(collectionName, id, data, actor)
publishCmsRecord(collectionName, id, actor)
archiveCmsRecord(collectionName, id, actor)
restoreCmsRecord(collectionName, id, actor)
getCmsRecord(collectionName, id)
listCmsRecords(collectionName, filters)
listPublishedRecords(collectionName, filters)
validateUniqueSlug(collectionName, slug, excludeId?)
```

### Required audit behavior

Every create, update, publish, archive, and restore action must write to `cms_audit_logs`.

Audit entry must include:

- collection name
- record ID
- action
- actor UID
- actor email
- timestamp
- short summary

---

## Phase 4: Resources Manager - first full CMS loop

### Goal

Implement the first complete working CMS-to-public-website loop using Resources.

### CMS routes to add

```text
/resources
/resources/new
/resources/:id/edit
```

Do not conflict with the public website route. These are CMS app routes, not public app routes.

### CMS sidebar update

Add a direct sidebar item:

```text
Resources Manager
```

It should route to:

```text
/resources
```

### CMS Resources list

Create:

```text
src/pages/resources/ResourcesListPage.tsx
```

Required features:

- table or card list of resources
- search by title or slug
- filter by status
- filter by resource type
- filter by category
- show published/draft/archived status
- quick actions:
  - edit
  - publish
  - archive
  - duplicate if easy
- empty state
- loading state
- error state

### CMS Resource editor

Create:

```text
src/pages/resources/ResourceEditorPage.tsx
src/components/resources/ResourceForm.tsx
```

Required fields:

- title
- slug
- resource type
- category
- excerpt
- body
- featured toggle
- read time
- image URL
- image alt text
- download URL
- CTA label
- CTA URL
- tags
- SEO title
- SEO description
- status

### Resource validation

Before publish, require:

- title
- unique slug
- resource type
- category
- excerpt
- SEO title
- SEO description
- image alt text if image URL exists

### Public website integration

Update public website file:

```text
src/app/pages/ResourcesPage.tsx
```

Replace hardcoded resources/categories as the primary data source.

Required behavior:

- fetch published records from `cms_resources`
- only show `status === 'published'` and `isPublished === true`
- derive categories from published resources where practical
- show featured resources from `featured === true`
- preserve the current visual layout as much as possible
- include loading state
- include empty state
- include error state
- keep fallback static content if Firestore fails

Create public website helper files:

```text
src/app/lib/firebase.ts
src/app/lib/publicCms.ts
src/app/types/cms.ts
```

If the existing folder conventions differ, adapt to the repo structure without creating an awkward parallel architecture.

---

## Phase 5: Navigation and Footer Manager

### Goal

Move header and footer content out of React components and into CMS-managed records.

### CMS routes

```text
/navigation
/navigation/new
/navigation/:id/edit
```

### Collections

Use:

```text
cms_navigation
```

### Fields

- label
- href
- nav area: header, footer, mobile, utility
- group
- parent item
- description
- icon key
- sort order
- external link flag
- open in new tab flag
- status
- isPublished

### Public website integration

Update:

```text
src/app/components/Navbar.tsx
src/app/components/Footer.tsx
```

Required behavior:

- fetch published navigation items
- render grouped dropdowns from CMS data
- render footer columns from CMS data
- preserve current hardcoded navigation as fallback
- avoid breaking current UX
- show only published items
- sort by `sortOrder`

### Validation

Before publish, require:

- label
- href
- nav area
- group if footer or dropdown item needs grouping

Add route/link warning if href appears empty, malformed, or obviously broken.

---

## Phase 6: Global Settings Manager

### Goal

Make global website settings editable from CMS.

### CMS route

Reuse or extend:

```text
/settings
```

### Collection

Use:

```text
cms_global_settings
```

Use a singleton document such as:

```text
site
```

### Settings to manage

- site name
- default SEO title
- default SEO description
- default Open Graph image
- contact email
- contact phone
- location text
- primary CTA label
- primary CTA URL
- footer disclosure
- affiliate disclosure
- finance disclaimer
- brand colors if already supported
- border radius if already supported

### Public website integration

Use settings in:

- Navbar fallback contact/brand areas where relevant
- Footer contact strip
- SEO defaults where relevant
- Finance disclaimer where relevant

Do not overbuild global theming yet. Preserve existing visual design unless a setting already exists.

---

## Phase 7: Offers Manager

### Goal

Move Offers page packages and partner deals into CMS.

### CMS routes

```text
/offers
/offers/new
/offers/:id/edit
```

### Collection

Use:

```text
cms_offers
```

### Required fields

- title
- slug
- offer type
- badge
- price label
- duration label
- excerpt
- body
- inclusions
- partner name
- partner logo URL
- category
- start date
- end date
- CTA label
- CTA URL
- terms
- disclosure
- featured
- status
- SEO title
- SEO description

### Public website integration

Update:

```text
src/app/pages/OffersPage.tsx
```

Required behavior:

- fetch published offers
- separate advisory packages from partner deals
- hide expired offers by default unless explicitly configured otherwise
- preserve existing layout where possible
- include loading, empty, error, and fallback states

### Validation

Before publish, require:

- title
- slug
- offer type
- excerpt
- CTA label
- CTA URL
- SEO title
- SEO description
- disclosure if partner deal or affiliate-style offer

---

## Phase 8: SEO Cockpit

### Goal

Create a central place to identify SEO problems and manage metadata.

### CMS route

```text
/seo
```

### Initial scope

Do not build a full SEO engine. Build a practical dashboard.

Display records across key collections:

- cms_resources
- cms_offers
- cms_navigation
- cms_document_products
- cms_pages if created

### SEO checks

Flag records with:

- missing SEO title
- missing SEO description
- duplicate slug
- title too short
- SEO title too long
- SEO description too short
- SEO description too long
- image without alt text
- published item missing CTA

### Dashboard columns

- content type
- title
- slug
- status
- SEO score
- issue count
- last updated
- action link to edit

### Acceptance criteria

- SEO cockpit lists content issues.
- It links back to the relevant edit page.
- It does not block publishing unless validation in that module requires it.

---

## Phase 9: Media Library

### Goal

Create a basic media management layer.

### CMS routes

```text
/media
/media/new
/media/:id/edit
```

### Collection

Use:

```text
cms_media_assets
```

### Storage

Use Firebase Storage if available.

### Fields

- title
- file name
- file URL
- storage path
- file type
- file size
- alt text
- caption
- category
- tags
- usage notes
- status
- uploaded by
- uploaded at

### Initial features

- upload asset
- list assets
- edit metadata
- archive asset
- copy URL
- require alt text for images before approved/published use

### Defer

Do not implement complex image transformations, cropping, or CDN optimization in this phase unless the repo already has a simple solution.

---

## Phase 10: Publishing Workflow

### Goal

Make publishing predictable and safe across all CMS content.

### Status model

Use:

```text
draft
review
approved
scheduled
published
archived
```

### Required actions

- Save draft
- Submit for review
- Approve
- Publish
- Schedule publish if simple
- Archive
- Restore

### Versioning

If full version history is too much for this phase, implement audit logs first and leave content version snapshots as a later task.

### Required publishing rules

- Only reviewer, admin, or owner can publish.
- Editor can save drafts and submit for review.
- Viewer cannot modify content.
- Archived content must not appear publicly.
- Draft content must not appear publicly.

---

## Phase 11: Lead and Enquiry Manager

### Goal

Start capturing and managing enquiries from the website.

### CMS routes

```text
/enquiries
/enquiries/:id
```

### Collection

Use:

```text
cms_lead_enquiries
```

### Enquiry types

- contact
- finance
- decision-desk
- document
- service
- membership
- marketplace

### Fields

- name
- email
- phone
- company
- enquiry type
- message
- source path
- status
- priority
- assigned to
- internal notes
- created at
- updated at

### Public website integration

Do not replace every form immediately.

Start with Contact page or Finance enquiry if a form already exists. If forms are only placeholders, create a simple reusable enquiry submission helper and document where it should be wired next.

### Acceptance criteria

- CMS can display enquiries.
- Admin can update status.
- Admin can add internal notes.
- Admin can assign priority.
- Public submission writes to Firestore only after basic validation.

---

## Phase 12: Document Product Manager

### Goal

Prepare Document Nucleus and DocuShare products for CMS control.

### CMS routes

```text
/documents
/documents/new
/documents/:id/edit
```

### Collection

Use:

```text
cms_document_products
```

### Required fields

- title
- slug
- product type
- category
- excerpt
- body
- price label
- Stripe product ID
- Stripe price ID
- delivery format
- turnaround time
- requires questionnaire
- required inputs
- sample URL
- image URL
- image alt text
- related product IDs
- status
- SEO title
- SEO description

### Public website integration

Update document-related pages only after Resources, Navigation, Global Settings, and Offers are working.

Target pages:

```text
src/app/pages/DocuSharePage.tsx
src/app/pages/DocumentOverviewPage.tsx
src/app/pages/DocumentCategoryPage.tsx
src/app/pages/DocumentProductPage.tsx
```

### Defer

Do not implement Stripe checkout, payment links, or fulfilment automation in this phase. Only store mapping fields and display content.

---

## Phase 13: Dashboard with Needs Attention alerts

### Goal

Make the CMS dashboard useful by showing what needs action.

### Update CMS dashboard

Update:

```text
src/pages/Dashboard.tsx
```

### Alerts to show

- draft content waiting for review
- published content missing SEO fields
- expired offers still published
- resources missing image alt text
- documents missing required delivery fields
- navigation items with empty or suspicious hrefs
- enquiries with status new
- finance content missing disclaimer or review date
- archived records count
- recently updated records

### Dashboard cards

Add summary cards:

- Published content
- Drafts in progress
- Needs review
- SEO issues
- New enquiries
- Expired offers
- Media missing alt text
- Recent changes

### Acceptance criteria

- Dashboard reads from real CMS collections.
- Dashboard does not rely on static placeholder numbers.
- Each alert links to the relevant module or edit screen.

---

## Firestore collection schema summary

Implement these collections progressively.

```text
cms_admin_users
cms_resources
cms_navigation
cms_global_settings
cms_offers
cms_media_assets
cms_document_products
cms_lead_enquiries
cms_audit_logs
```

Optional later collections:

```text
cms_pages
cms_sections
cms_redirects
cms_campaigns
cms_membership_plans
cms_applications
cms_marketplace_products
cms_decision_desk_requests
```

---

## Firestore security rule expectations

Do not ship permissive production rules.

Minimum expectations:

- Public website may read only published public content.
- CMS users may read CMS content only if authenticated and active.
- Only approved roles may create/update/publish/archive records.
- Audit logs should be create-only for normal admin users.
- Admin users collection should not be publicly writable.

Suggested high-level rule intent:

```text
Public read:
Allow read for selected CMS collections only when status is published and isPublished is true.

CMS read/write:
Allow authenticated users with active cms_admin_users role.

Publishing:
Allow only reviewer, admin, owner.

Settings:
Allow only admin or owner.
```

Implement exact rules according to the Firebase project structure.

---

## Deployment requirements

Add deployment config only after confirming the current hosting approach.

The live testing URL appears to be hosted on Cloudflare Workers or Pages. Do not assume Firebase Hosting is the deployment target for the public website unless project configuration confirms it.

For each repo, inspect whether any of these exist:

```text
wrangler.toml
firebase.json
.firebaserc
vercel.json
netlify.toml
.github/workflows/*
```

If no deployment config exists, document the recommended deployment setup rather than inventing one blindly.

### Minimum deployment checks

Before finalizing any phase, run:

```text
npm install
npm run build
npm run lint
```

If lint is not configured or fails due to existing unrelated issues, document this clearly.

---

## Implementation priorities

### Priority 1: Foundation

- Firebase setup
- Auth setup
- CMS types
- CMS repository helpers
- audit logs
- protected routes

### Priority 2: First live loop

- Resources Manager in CMS
- public Resources page CMS integration
- published-only read behavior

### Priority 3: Site structure control

- Navigation Manager
- Footer Manager
- Global Settings Manager

### Priority 4: Commercial content

- Offers Manager
- Finance content manager
- Document Product Manager

### Priority 5: Operational control

- SEO Cockpit
- Media Library
- Publishing Workflow
- Lead and Enquiry Manager
- Needs Attention dashboard

---

## Required final deliverables from Antigravity

At the end of implementation, provide:

1. Summary of what was implemented.
2. Files created.
3. Files modified.
4. Firestore collections added or expected.
5. Environment variables required.
6. Public website pages connected to CMS.
7. CMS routes added.
8. Authentication and role behavior summary.
9. Publishing workflow summary.
10. Known limitations.
11. Manual QA checklist.
12. Build/lint results.

---

## Manual QA checklist

### CMS authentication

- Visit CMS while logged out.
- Confirm redirect to login.
- Log in as admin.
- Confirm CMS loads.
- Log out.
- Confirm CMS becomes inaccessible.

### Resources Manager

- Create draft resource.
- Confirm draft appears in CMS list.
- Confirm draft does not appear on public site.
- Publish resource.
- Confirm published resource appears on public Resources page.
- Archive resource.
- Confirm archived resource disappears from public site.
- Confirm audit logs are created.

### Navigation Manager

- Create a draft nav item.
- Confirm it does not appear publicly.
- Publish nav item.
- Confirm it appears in correct nav area.
- Archive nav item.
- Confirm it disappears.

### Offers Manager

- Create draft offer.
- Publish offer.
- Confirm it appears on Offers page.
- Set expired end date.
- Confirm expired offer is hidden or flagged according to implemented logic.

### SEO Cockpit

- Create record missing SEO fields.
- Confirm SEO Cockpit flags it.
- Add SEO fields.
- Confirm issue clears.

### Dashboard alerts

- Create new enquiry.
- Confirm dashboard shows new enquiry alert.
- Create published resource missing image alt text.
- Confirm dashboard flags it.

---

## Important implementation notes

1. Do not remove existing static content until CMS integration is stable.
2. Use static content as fallback while Firestore integration is being tested.
3. Keep UI changes minimal unless required for functionality.
4. Prefer reusable CMS components over one-off pages.
5. Keep Firestore reads efficient.
6. Avoid exposing draft records to the public app.
7. Do not hardcode Firebase secrets.
8. Do not add payment fulfilment in this implementation.
9. Do not overbuild Notion sync in this phase.
10. Document all assumptions.

---

## Definition of done

This implementation is complete when:

- CMS is protected by authentication.
- CMS can create, edit, publish, and archive Resources.
- Public Resources page reads published CMS records.
- Draft and archived records do not appear publicly.
- Audit logs are written for key CMS actions.
- Navigation/Footer Manager has at least the data model and initial admin UI, or is clearly queued after Resources if scope is limited.
- Global Settings Manager has a persisted singleton document.
- Build command succeeds for touched repositories or failures are clearly documented.
- A manual QA checklist is provided.
