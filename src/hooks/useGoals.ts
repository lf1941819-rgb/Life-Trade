import * as React from 'react';
import { auth } from '../lib/firebase';
import { Goal } from '../types';
import { goalService } from '../lib/services/goalService';

export function useGoals() {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth.currentUser) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = goalService.subscribeToGoals(
      auth.currentUser.uid,
      (data) => {
        setGoals(data);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId'>) => {
    if (!auth.currentUser) return;
    return await goalService.createGoal({
      ...goal,
      userId: auth.currentUser.uid,
    });
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    return await goalService.updateGoal(id, goal);
  };

  const deleteGoal = async (id: string) => {
    return await goalService.deleteGoal(id);
  };

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
