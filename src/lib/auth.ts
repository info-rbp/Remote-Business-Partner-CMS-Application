import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { CmsAdminUser } from '../types/auth';

export const login = async (email: string, password: string): Promise<CmsAdminUser> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  
  // Verify role
  const roleDoc = await getDoc(doc(db, 'cms_admin_users', user.uid));
  
  if (!roleDoc.exists()) {
    await signOut(auth);
    throw new Error('User does not have CMS access.');
  }

  const userData = roleDoc.data() as CmsAdminUser;
  
  if (!userData.isActive) {
    await signOut(auth);
    throw new Error('User account is inactive.');
  }

  return userData;
};

export const logout = async () => {
  await signOut(auth);
};
