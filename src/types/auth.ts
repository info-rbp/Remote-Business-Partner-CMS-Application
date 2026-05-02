export type CmsRole = 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer';

export interface CmsAdminUser {
  uid: string;
  email: string;
  role: CmsRole;
  isActive: boolean;
  createdAt: unknown;
  updatedAt: unknown;
}
