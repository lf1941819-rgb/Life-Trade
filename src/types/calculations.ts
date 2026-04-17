
export type CalculationMode = 'direct_points_money' | 'price_difference_contract' | 'custom_symbol_formula';
export type InstrumentCategory = 'forex' | 'crypto' | 'precious-metals' | 'energies';
export type InstrumentSubcategory = 'gold' | 'silver' | 'oil' | 'major' | 'minor' | 'exotic';

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  category: InstrumentCategory;
  subcategory?: InstrumentSubcategory;
  broker: string;
  isActive: boolean;
  calculationMode: CalculationMode;
  contractSize: number;
  referenceLot: number;
  referencePoints: number;
  referenceMoneyValue: number;
  pointSize: number;
  pipSize?: number;
  tickSize?: number;
  quoteCurrency: string;
  accountCurrency: string;
  pricePrecision: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CalculationSnapshot {
  contractSize: number;
  pointSize: number;
  referenceLot: number;
  referencePoints: number;
  referenceMoneyValue: number;
  calculationMode: CalculationMode;
  symbol: string;
  category: InstrumentCategory;
}

export type OperationStatus = 'PROFIT' | 'GAIN' | 'LOSS';

export interface Operation {
  id: string;
  userId: string;
  instrumentId: string;
  symbol: string;
  category: InstrumentCategory;
  type: 'Buy' | 'Sell';
  date: string;
  time: string;
  entryPrice?: number;
  exitPrice?: number;
  points: number;
  targetPoints: number;
  stopPoints: number;
  loteSugerido: number;
  loteUsado: number;
  isManualLotOverride: boolean;
  status: OperationStatus;
  moneyResult: number;
  currency: string;
  calculationMode: CalculationMode;
  calculationSnapshot: CalculationSnapshot;
  observation?: string;
  setup?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}
