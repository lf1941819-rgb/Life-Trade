import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Goal } from '../../types';

const COLLECTION_NAME = 'goals';

export const goalService = {
  subscribeToGoals: (userId: string, callback: (goals: Goal[]) => void) => {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
      callback(goals);
    }, (error) => {
      console.error('goalService error:', error);
      throw error;
    });
  },

  createGoal: async (goal: Omit<Goal, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...goal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('goalService error:', error);
      throw error;
    }
  },

  updateGoal: async (id: string, goal: Partial<Goal>) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...goal,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('goalService error:', error);
      throw error;
    }
  },

  deleteGoal: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('goalService error:', error);
      throw error;
    }
  }
};
