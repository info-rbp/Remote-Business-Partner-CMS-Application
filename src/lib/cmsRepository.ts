import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { logAuditAction } from './auditLog';
import type { CmsAdminUser } from '../types/auth';
import type { CmsBaseRecord } from '../types/cms';

export async function createCmsRecord<T extends Omit<CmsBaseRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>>(
  collectionName: string,
  data: T,
  actor: CmsAdminUser
): Promise<string> {
  const newRef = doc(collection(db, collectionName));
  const record = {
    ...data,
    id: newRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: actor.uid,
    updatedBy: actor.uid,
  };

  await setDoc(newRef, record);
  await logAuditAction(collectionName, newRef.id, 'create', actor, `Created ${data.title}`);
  return newRef.id;
}

export async function updateCmsRecord<T extends Partial<any>>(
  collectionName: string,
  id: string,
  data: T,
  actor: CmsAdminUser
): Promise<void> {
  const recordRef = doc(db, collectionName, id);
  const updateData = {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: actor.uid,
  };

  await updateDoc(recordRef, updateData);
  await logAuditAction(collectionName, id, 'update', actor, `Updated record`);
}


export async function publishCmsRecord(
  collectionName: string,
  id: string,
  actor: CmsAdminUser
): Promise<void> {
  const recordRef = doc(db, collectionName, id);
  await updateDoc(recordRef, {
    status: 'published',
    isPublished: true,
    publishedAt: serverTimestamp(),
    publishedBy: actor.uid,
    updatedAt: serverTimestamp(),
    updatedBy: actor.uid,
  });

  await logAuditAction(collectionName, id, 'publish', actor, `Published record`);
}

export async function archiveCmsRecord(
  collectionName: string,
  id: string,
  actor: CmsAdminUser
): Promise<void> {
  const recordRef = doc(db, collectionName, id);
  await updateDoc(recordRef, {
    status: 'archived',
    isPublished: false,
    archivedAt: serverTimestamp(),
    archivedBy: actor.uid,
    updatedAt: serverTimestamp(),
    updatedBy: actor.uid,
  });

  await logAuditAction(collectionName, id, 'archive', actor, `Archived record`);
}

export async function restoreCmsRecord(
  collectionName: string,
  id: string,
  actor: CmsAdminUser
): Promise<void> {
  const recordRef = doc(db, collectionName, id);
  await updateDoc(recordRef, {
    status: 'draft',
    isPublished: false,
    archivedAt: null,
    archivedBy: null,
    updatedAt: serverTimestamp(),
    updatedBy: actor.uid,
  });

  await logAuditAction(collectionName, id, 'restore', actor, `Restored record to draft`);
}

export async function getCmsRecord<T>(collectionName: string, id: string): Promise<T | null> {
  const recordRef = doc(db, collectionName, id);
  const snap = await getDoc(recordRef);
  if (!snap.exists()) return null;
  return snap.data() as T;
}

export async function listCmsRecords<T>(collectionName: string): Promise<T[]> {
  const q = query(collection(db, collectionName), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data() as T);
}

export async function listPublishedRecords<T>(collectionName: string): Promise<T[]> {
  const q = query(
    collection(db, collectionName), 
    where('status', '==', 'published'),
    where('isPublished', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data() as T);
}

export async function validateUniqueSlug(
  collectionName: string, 
  slug: string, 
  excludeId?: string
): Promise<boolean> {
  const q = query(collection(db, collectionName), where('slug', '==', slug));
  const snap = await getDocs(q);
  
  if (snap.empty) return true;
  if (snap.docs.length === 1 && snap.docs[0].id === excludeId) return true;
  return false;
}
