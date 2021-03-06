interface Payload {
  img: string,
  modelName: string,
  brandName: string,
  href: string,
  tables: Array<Array<VariationTableRow>>,
  equipment: EquipmentLists,
  extraEquipment: Array<EquipmentList>,
  techSpecsList: Array<TechSpecs>,
  colors: Array<ColorVariation>,
}
