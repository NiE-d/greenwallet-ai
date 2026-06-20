// CO2 emission factors (kg CO2 per unit)
export const CO2_FACTORS = {
  // per km driven
  carPerKm: 0.17,
  bikePerKm: 0.04,
  metroPerKm: 0.03,
  busPerKm: 0.05,

  // per ₹ of electricity bill (avg Indian grid)
  electricityPerRupee: 0.0008,

  // per food delivery order
  deliveryPerOrder: 0.5,

  // per ₹ of food wasted
  foodWastePerRupee: 0.003,

  // trees absorb per year (kg CO2)
  treeCO2PerYear: 21,

  // avg car emits per km (kg CO2)
  carEmissionPerKm: 0.21,
} as const
