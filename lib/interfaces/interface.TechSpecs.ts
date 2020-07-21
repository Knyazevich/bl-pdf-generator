interface TechSpecs {
  title: String,
  meta: String,
  engineAndPerformance: {
    fuelType: String,
    numberOfCylinders: Number,
    inductionCapacity: Number,
    transmission: String,
    wheelsDriven: String,
    maxPower: Number,
    maxTorgue: Number,
    acceleration: Number,
    maxSpeed: Number,
  },
  spendingAndExhaust: {
    fuelConsumptionCombined: Number,
    co2: Number,
    emissionStandard: Number,
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
