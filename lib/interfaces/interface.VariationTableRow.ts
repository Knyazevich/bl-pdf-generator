interface VariationTableRow {
  name: string,
  capacity: number,
  fuelType: string,
  transmission: string,
  fuelConsumptionCombined: number,
  maxPower: number,
  co2: number, // Oil cars only
  range: number, // Hybrids/Electric cars only
  loan: number,
  price: number,
}
