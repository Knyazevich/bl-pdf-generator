interface Payload {
  img: String,
  modelName: String,
  brandName: String,
  tables: Array<Array<VariationTableRow>>
  techSpecsList: Array<TechSpecs>
  colors: Array<ColorVariation>
}
