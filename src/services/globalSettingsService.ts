import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CMS_COLLECTIONS } from '../lib/cmsCollections';
import type { CmsGlobalSettings } from '../types/cms';
import type { CmsAdminUser } from '../types/auth';
import { logAuditAction } from '../lib/auditLog';

const SETTINGS_DOC_ID = 'site';

export async function fetchGlobalSettings(): Promise<CmsGlobalSettings | null> {
  const ref = doc(db, CMS_COLLECTIONS.globalSettings, SETTINGS_DOC_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as CmsGlobalSettings;
}

export async function saveGlobalSettings(
  data: Omit<CmsGlobalSettings, 'id' | 'updatedAt' | 'updatedBy'>,
  actor: CmsAdminUser
): Promise<void> {
  const ref = doc(db, CMS_COLLECTIONS.globalSettings, SETTINGS_DOC_ID);
  await setDoc(ref, {
    ...data,
    id: SETTINGS_DOC_ID,
    updatedAt: serverTimestamp(),
    updatedBy: actor.uid,
  }, { merge: true });

  await logAuditAction(CMS_COLLECTIONS.globalSettings, SETTINGS_DOC_ID, 'update', actor, 'Updated global site settings');
}
