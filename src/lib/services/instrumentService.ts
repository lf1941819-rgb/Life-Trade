
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Instrument } from '../../types/calculations';
import { INSTRUMENT_PRESETS } from '../calculations/instrumentModels';

const COLLECTION_NAME = 'instruments';

export const instrumentService = {
  async initializePresets() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (snapshot.empty) {
        for (const preset of INSTRUMENT_PRESETS) {
          await this.createInstrument(preset as Instrument);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  },

  async createInstrument(instrument: Omit<Instrument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...instrument,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  async updateInstrument(id: string, instrument: Partial<Instrument>) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...instrument,
        updatedAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    }
  },

  async deleteInstrument(id: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  },

  async resetToPresets() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      for (const preset of INSTRUMENT_PRESETS) {
        await this.createInstrument(preset as Instrument);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTION_NAME);
    }
  },

  subscribeToInstruments(callback: (instruments: Instrument[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('symbol', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const instruments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Instrument[];
      callback(instruments);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  }
};
