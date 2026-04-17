import * as React from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { UserProfile } from '@/src/types';

export function useAuth() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const existingData = userDoc.data() as UserProfile;
          // Sync photoURL and name if they've changed on Google
          if (existingData.photoURL !== firebaseUser.photoURL || existingData.name !== (firebaseUser.displayName || 'Trader')) {
            const updatedProfile = {
              ...existingData,
              name: firebaseUser.displayName || existingData.name,
              photoURL: firebaseUser.photoURL || existingData.photoURL
            };
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setUser(updatedProfile);
          } else {
            setUser(existingData);
          }
        } else {
          // Create initial profile
          const newProfile: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Trader',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined,
            mainCurrency: 'USD',
            theme: 'dark',
          };
          await setDoc(userDocRef, newProfile);
          setUser(newProfile);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
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
