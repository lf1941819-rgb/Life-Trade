import * as React from 'react';
import { auth } from '@/src/lib/firebase';
import { Operation } from '@/src/types/calculations';
import { operationService } from '@/src/lib/services/operationService';

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
    return await operationService.createOperation({
      ...op,
      userId: auth.currentUser.uid,
    });
  }, [auth.currentUser]);

  const updateOperation = React.useCallback(async (id: string, op: Partial<Operation>) => {
    return await operationService.updateOperation(id, op);
  }, []);

  const deleteOperation = React.useCallback(async (id: string) => {
    return await operationService.deleteOperation(id);
  }, []);

  const closeOperation = React.useCallback(async (id: string, status: 'GAIN' | 'LOSS', moneyResult: number, exitPrice?: number) => {
    return await operationService.closeOperation(id, status, moneyResult, exitPrice);
  }, []);

  return React.useMemo(() => ({
    operations,
    isLoading,
    addOperation,
    updateOperation,
    deleteOperation,
    closeOperation,
  }), [operations, isLoading, addOperation, updateOperation, deleteOperation, closeOperation]);
}
