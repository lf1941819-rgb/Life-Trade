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
import { CalendarEvent } from '../../types';

const COLLECTION_NAME = 'events';

export const eventService = {
  subscribeToEvents: (userId: string, callback: (events: CalendarEvent[]) => void) => {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', userId),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CalendarEvent[];
      callback(events);
    }, (error) => {
      console.error('eventService error:', error);
      throw error;
    });
  },

  createEvent: async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('eventService error:', error);
      throw error;
    }
  },

  updateEvent: async (id: string, event: Partial<CalendarEvent>) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...event,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('eventService error:', error);
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('eventService error:', error);
      throw error;
    }
  }
};
