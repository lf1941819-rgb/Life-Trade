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
import { Invoice } from '../../types';

const COLLECTION_NAME = 'invoices';

export const invoiceService = {
  subscribeToInvoices: (userId: string, callback: (invoices: Invoice[]) => void) => {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const invoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];
      callback(invoices);
    }, (error) => {
      console.error('invoiceService error:', error);
      throw error;
    });
  },

  createInvoice: async (invoice: Omit<Invoice, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...invoice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('invoiceService error:', error);
      throw error;
    }
  },

  updateInvoice: async (id: string, invoice: Partial<Invoice>) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...invoice,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('invoiceService error:', error);
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('invoiceService error:', error);
      throw error;
    }
  }
};
