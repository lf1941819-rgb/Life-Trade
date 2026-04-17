
import { Instrument, CalculationSnapshot } from '../../types/calculations';
import { INSTRUMENT_PRESETS } from './instrumentModels';

export function getInstrumentSnapshot(instrument: Instrument): CalculationSnapshot {
  return {
    contractSize: instrument.contractSize,
    pointSize: instrument.pointSize,
    referenceLot: instrument.referenceLot,
    referencePoints: instrument.referencePoints,
    referenceMoneyValue: instrument.referenceMoneyValue,
    calculationMode: instrument.calculationMode,
    symbol: instrument.symbol,
    category: instrument.category
  };
}

export function findPresetBySymbol(symbol: string): Partial<Instrument> | undefined {
  return INSTRUMENT_PRESETS.find(p => p.symbol === symbol);
}
