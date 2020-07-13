interface Payload {
  img: String,
  modelName: String,
  brandName: String,
  tables: Array<Array<VariationTableRow>>,
  equipment: EquipmentLists,
  extraEquipment: Array<EquipmentList>,
  techSpecsList: Array<TechSpecs>,
  colors: Array<ColorVariation>,
}
