import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import type { CmsAdminUser } from '../../types/auth';

interface AuthContextType {
  user: User | null;
  adminData: CmsAdminUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  adminData: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<CmsAdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Fetch role data
          const roleDoc = await getDoc(doc(db, 'cms_admin_users', firebaseUser.uid));
          if (roleDoc.exists() && roleDoc.data().isActive) {
            setAdminData(roleDoc.data() as CmsAdminUser);
          } else {
            setAdminData(null);
            // We do not force logout here to prevent infinite redirect loops, 
            // but ProtectedRoute will block access since adminData is null.
          }
        } catch (error) {
          console.error("Error fetching admin role:", error);
          setAdminData(null);
        }
      } else {
        setUser(null);
        setAdminData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, adminData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
