
import { CalculationSnapshot, CalculationMode } from '../../types/calculations';

export function calculateOperationResult(
  points: number,
  lot: number,
  snapshot: CalculationSnapshot
): number {
  const {
    calculationMode,
    referenceLot,
    referencePoints,
    referenceMoneyValue,
    contractSize,
    pointSize
  } = snapshot;

  switch (calculationMode) {
    case 'direct_points_money':
      // Formula: money = (points / referencePoints) * (lot / referenceLot) * referenceMoneyValue
      if (referencePoints === 0 || referenceLot === 0) return 0;
      return (points / referencePoints) * (lot / referenceLot) * referenceMoneyValue;

    case 'price_difference_contract':
      // Formula: money = points * pointSize * contractSize * lot
      // Note: In this mode, points are the absolute difference in price units
      return points * pointSize * contractSize * lot;

    case 'custom_symbol_formula':
      // Defaulting to direct_points_money for now, can be expanded for specific symbols
      return (points / referencePoints) * (lot / referenceLot) * referenceMoneyValue;

    default:
      return 0;
  }
}

export function calculateValuePerPoint(
  lot: number,
  snapshot: CalculationSnapshot
): number {
  const {
    calculationMode,
    referenceLot,
    referencePoints,
    referenceMoneyValue,
    contractSize,
    pointSize
  } = snapshot;

  switch (calculationMode) {
    case 'direct_points_money':
      if (referencePoints === 0 || referenceLot === 0) return 0;
      return (1 / referencePoints) * (lot / referenceLot) * referenceMoneyValue;

    case 'price_difference_contract':
      return pointSize * contractSize * lot;

    default:
      return (1 / referencePoints) * (lot / referenceLot) * referenceMoneyValue;
  }
}
