interface TechSpecs {
  title: string,
  meta: string,
  engineAndPerformance: {
    fuelType: string,
    numberOfCylinders: number,
    inductionCapacity: number,
    transmission: string,
    wheelsDriven: string,
    maxPower: number,
    maxTorgue: number,
    acceleration: number,
    maxSpeed: number,
  },
  spendingAndExhaust: {
    fuelConsumptionCombined: number,
    co2: number,
    emissionStandard: number,
  },
  mainIssues: {
    overallLength: number,
    overallWidth: number,
    loadVolumeLitres: number,
    maximumLoadVolumeLitres: number,
    ownWeight: number,
    maxWeight: number,
  }
}
