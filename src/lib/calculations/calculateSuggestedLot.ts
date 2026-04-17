
export function calculateSuggestedLot(totalOperations: number): number {
  // Starts at 0.01
  // Every 10 operations the suggested lot goes up +0.01
  const cycles = Math.floor(totalOperations / 10);
  const suggestedLot = 0.01 + (cycles * 0.01);
  
  // Return with 2 decimal precision
  return Math.round(suggestedLot * 100) / 100;
}
