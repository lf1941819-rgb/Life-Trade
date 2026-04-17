import * as React from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const existingData = userDoc.data() as UserProfile;

            // Atualiza dados se mudaram no Google
            const updatedProfile: UserProfile = {
              ...existingData,
              name: firebaseUser.displayName || existingData.name || 'Trader',
              email: firebaseUser.email || existingData.email || '',
              photoURL: firebaseUser.photoURL || existingData.photoURL,
              mainCurrency: existingData.mainCurrency || 'USD',
              theme: existingData.theme || 'dark',
              id: firebaseUser.uid,
            };

            await setDoc(userDocRef, updatedProfile, { merge: true });
            setUser(updatedProfile);

          } else {
            // 🔥 CRIA USUÁRIO (ESSENCIAL)
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Trader',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || undefined,
              mainCurrency: 'USD',
              theme: 'dark',
            };

            await setDoc(userDocRef, newProfile);

            // 🔥 CRIA SETTINGS INICIAIS (IMPORTANTE)
            await setDoc(doc(db, 'users', firebaseUser.uid, 'progression', 'settings'), {
              initialLot: 0.01,
              increment: 0.01,
              operationsPerCycle: 10,
              totalOperations: 0,
              currentLot: 0.01
            });

            setUser(newProfile);
          }

        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth sync error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    loginWithGoogle,
    logout,
  };
}