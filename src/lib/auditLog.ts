import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { CMS_COLLECTIONS } from './cmsCollections';
import type { CmsAdminUser } from '../types/auth';
import type { CmsAuditLog } from '../types/cms';

export async function logAuditAction(
  collectionName: string,
  recordId: string,
  action: CmsAuditLog['action'],
  actor: CmsAdminUser,
  summary?: string
): Promise<void> {
  const logEntry: Omit<CmsAuditLog, 'id'> = {
    collectionName,
    recordId,
    action,
    actorId: actor.uid,
    actorEmail: actor.email,
    timestamp: serverTimestamp(),
    summary,
  };

  await addDoc(collection(db, CMS_COLLECTIONS.auditLogs), logEntry);
}
