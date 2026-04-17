import * as React from 'react';
import { auth } from '../lib/firebase';
import { Operation } from '../types/calculations';
import { operationService } from '../lib/services/operationService';

export function useOperations() {
  const [operations, setOperations] = React.useState<Operation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth.currentUser) {
      setOperations([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = operationService.subscribeToOperations(
      auth.currentUser.uid,
      (ops) => {
        setOperations(ops);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addOperation = React.useCallback(async (op: Omit<Operation, 'id' | 'createdAt' | 'userId' | 'updatedAt'>) => {
    if (!auth.currentUser) return;
    return await operationService.createOperation(auth.currentUser.uid, op);
  }, [auth.currentUser]);

  const updateOperation = React.useCallback(async (id: string, op: Partial<Operation>) => {
    if (!auth.currentUser) return;
    return await operationService.updateOperation(auth.currentUser.uid, id, op);
  }, [auth.currentUser]);

  const deleteOperation = React.useCallback(async (id: string) => {
    if (!auth.currentUser) return;
    return await operationService.deleteOperation(auth.currentUser.uid, id);
  }, [auth.currentUser]);

  const closeOperation = React.useCallback(async (id: string, status: 'GAIN' | 'LOSS', moneyResult: number, exitPrice?: number) => {
    if (!auth.currentUser) return;
    return await operationService.closeOperation(auth.currentUser.uid, id, status, moneyResult, exitPrice);
  }, [auth.currentUser]);

  return React.useMemo(() => ({
    operations,
    isLoading,
    addOperation,
    updateOperation,
    deleteOperation,
    closeOperation,
  }), [operations, isLoading, addOperation, updateOperation, deleteOperation, closeOperation]);
}
