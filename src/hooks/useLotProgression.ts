import * as React from 'react';

interface LotProgressionProps {
  initialLot: number;
  increment: number;
  operationsPerCycle: number;
  totalOperations: number;
}

export function useLotProgression({
  initialLot,
  increment,
  operationsPerCycle,
  totalOperations,
}: LotProgressionProps) {
  const currentLot = React.useMemo(() => {
    const completedCycles = Math.floor(totalOperations / operationsPerCycle);
    return Number((initialLot + completedCycles * increment).toFixed(2));
  }, [initialLot, increment, operationsPerCycle, totalOperations]);

  const operationsInCurrentCycle = totalOperations % operationsPerCycle;
  const operationsRemainingForNextLot = operationsPerCycle - operationsInCurrentCycle;
  const nextLot = Number((currentLot + increment).toFixed(2));

  return {
    currentLot,
    nextLot,
    operationsRemainingForNextLot,
    completedCycles: Math.floor(totalOperations / operationsPerCycle),
  };
}
