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
    overallLength: Number,
    overallWidth: Number,
    loadVolumeLitres: Number,
    maximumLoadVolumeLitres: Number,
    ownWeight: Number,
    maxWeight: Number,
  }
}
