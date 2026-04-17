import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Operation } from '../../types/calculations';

const USERS_COLLECTION = 'users';
const OPERATIONS_COLLECTION = 'operations';

type OperationAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LIST';

function handleOperationError(
  error: unknown,
  action: OperationAction,
  target: string
): never {
  console.error(`[operationService:${action}] Error on ${target}`, error);

  if (error instanceof Error) {
    throw new Error(`[operationService:${action}] ${error.message}`);
  }

  throw new Error(`[operationService:${action}] Unknown error on ${target}`);
}

function getOperationsCollectionRef(userId: string) {
  return collection(db, USERS_COLLECTION, userId, OPERATIONS_COLLECTION);
}

function getOperationDocRef(userId: string, operationId: string) {
  return doc(db, USERS_COLLECTION, userId, OPERATIONS_COLLECTION, operationId);
}

export const operationService = {
  async createOperation(
    userId: string,
    operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
  ): Promise<string> {
    try {
      const now = Date.now();

      const docRef = await addDoc(getOperationsCollectionRef(userId), {
        ...operation,
        userId,
        createdAt: now,
        updatedAt: now,
      });

      return docRef.id;
    } catch (error) {
      handleOperationError(
        error,
        'CREATE',
        `${USERS_COLLECTION}/${userId}/${OPERATIONS_COLLECTION}`
      );
    }
  },

  async updateOperation(
    userId: string,
    operationId: string,
    operation: Partial<Operation>
  ): Promise<void> {
    try {
      const docRef = getOperationDocRef(userId, operationId);

      const { id, userId: _, createdAt, ...safeUpdate } = operation;

      await updateDoc(docRef, {
        ...safeUpdate,
        updatedAt: Date.now(),
      });
    } catch (error) {
      handleOperationError(
        error,
        'UPDATE',
        `${USERS_COLLECTION}/${userId}/${OPERATIONS_COLLECTION}/${operationId}`
      );
    }
  },

  async deleteOperation(userId: string, operationId: string): Promise<void> {
    try {
      const docRef = getOperationDocRef(userId, operationId);
      await deleteDoc(docRef);
    } catch (error) {
      handleOperationError(
        error,
        'DELETE',
        `${USERS_COLLECTION}/${userId}/${OPERATIONS_COLLECTION}/${operationId}`
      );
    }
  },

  async closeOperation(
    userId: string,
    operationId: string,
    status: 'GAIN' | 'LOSS',
    moneyResult: number,
    exitPrice?: number
  ): Promise<void> {
    try {
      const docRef = getOperationDocRef(userId, operationId);

      await updateDoc(docRef, {
        status,
        moneyResult,
        ...(exitPrice !== undefined ? { exitPrice } : {}),
        updatedAt: Date.now(),
      });
    } catch (error) {
      handleOperationError(
        error,
        'UPDATE',
        `${USERS_COLLECTION}/${userId}/${OPERATIONS_COLLECTION}/${operationId}`
      );
    }
  },

  subscribeToOperations(
    userId: string,
    callback: (operations: Operation[]) => void
  ) {
    const q = query(
      getOperationsCollectionRef(userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const operations = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Operation[];

        callback(operations);
      },
      (error) => {
        console.error(
          `[operationService:LIST] Error on users/${userId}/operations`,
          error
        );
        callback([]);
      }
    );
  },

  async getOperationCount(userId: string): Promise<number> {
    try {
      const snapshot = await getDocs(getOperationsCollectionRef(userId));
      return snapshot.size;
    } catch (error) {
      console.error(
        `[operationService:LIST] Error counting users/${userId}/operations`,
        error
      );
      return 0;
    }
  },
};