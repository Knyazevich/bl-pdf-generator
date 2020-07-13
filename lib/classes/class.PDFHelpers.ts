import QRCode from 'qrcode';

class PDFHelpers {
  public static getVariationTablesHTML(tablesData: Array<Array<VariationTableRow>>) {
    const oilBasedCars = tablesData[0];
    const ecoCars = tablesData[1];
    let markup = '';

    const tableHeader = `
      <div class="table-container">
        <table class="auto-info-table">
          <thead class="auto-info-table__header">
          <tr class="auto-info-table__header-row">
            <th class="auto-info-table__header-title">Gerð</th>
            <th class="auto-info-table__header-title">Orkugjafi</th>
            <th class="auto-info-table__header-title">Skipting</th>
            <th class="auto-info-table__header-title">Skipting</th>
            <th class="auto-info-table__header-title">Eyðsla/bl.*</th>
            <th class="auto-info-table__header-title">Hestöfl</th>
            <th class="auto-info-table__header-title">Co2</th>
            <th class="auto-info-table__header-title">Verð</th>
            <th class="auto-info-table__header-title">90% lán*</th>
          </tr>
          </thead>
        
          <tbody class="auto-info-table__main">
    `;

    const tableFooter = '</tbody></table></div>';

    if (oilBasedCars.length) {
      markup += tableHeader;

      oilBasedCars.forEach((car: VariationTableRow) => {
        markup += `
        <tr class="auto-info-table__main-row">
          <td class="auto-info-table__main-cell">${car.name}</td>
          <td class="auto-info-table__main-cell"><span>${car.capacity}</span> cc</td>
          <td class="auto-info-table__main-cell">${car.fuelType}</td>
          <td class="auto-info-table__main-cell">${car.transmission}</td>
          <td class="auto-info-table__main-cell">${car.fuelConsumptionCombined} l/100</td>
          <td class="auto-info-table__main-cell">${car.maxPower}</td>
          <td class="auto-info-table__main-cell">${car.co2}</td>
          <td class="auto-info-table__main-cell"><span>${car.range}</span> <span>kr.</span></td>
          <td class="auto-info-table__main-cell"><span>${car.price}</span> <span>kr.</span></td>
        </tr>
      `;
      });

      markup += tableFooter;
    }

    if (ecoCars.length) {
      markup += tableHeader;

      ecoCars.forEach((car: VariationTableRow) => {
        markup += `
        <tr class="auto-info-table__main-row">
          <td class="auto-info-table__main-cell">
            <span class="badge eco-badge">
              <img src="{{assetsPath}}/img/eco-badge.svg" alt="" class="badge-image">
            </span>
            
            ${car.name}
          </td>
          <td class="auto-info-table__main-cell"><span>${car.capacity}</span> cc</td>
          <td class="auto-info-table__main-cell">${car.fuelType}</td>
          <td class="auto-info-table__main-cell">${car.transmission}</td>
          <td class="auto-info-table__main-cell">${car.fuelConsumptionCombined} l/100</td>
          <td class="auto-info-table__main-cell">${car.maxPower}</td>
          <td class="auto-info-table__main-cell">${car.co2}</td>
          <td class="auto-info-table__main-cell"><span>${car.range}</span> <span>kr.</span></td>
          <td class="auto-info-table__main-cell"><span>${car.price}</span> <span>kr.</span></td>
        </tr>
      `;
      });

      markup += tableFooter;
    }

    return markup;
  }

  public static getColorsHTML(colors: Array<ColorVariation>) {
    let markup = '';

    if (!colors || !colors.length) {
      return markup;
    }

    const colorsWithImages = colors.filter((color: ColorVariation) => !!color.img);

    if (!colorsWithImages.length) {
      return markup;
    }

    markup += `
     <section class="colors">
        <h1 class="primary-title primary-title--margin dark-blue">Litir í boði</h1>
        <ul class="car-colors car-colors-list">
    `;

    colorsWithImages.forEach((color: ColorVariation) => {
      markup += `
      <li class="car-colors__list-item">
        <div class="car-colors__image-box">
          <img src="${color.img}" alt="" class="car-colors__image">
        </div>
        
        <p class="car-colors__color car-colors__color--margin">${color.title}</p>
      </li>
      `;
    });

    markup += '</ul></section>';

    return markup;
  }

  public static async getQRCode(url: string) {
    try {
      return await QRCode.toDataURL(url);
    } catch (e) {
      return '';
    }
  }

  public static getCurrentMonth() {
    const months = [
      'janúar',
      'febrúar',
      'mars',
      'apríl',
      'maí',
      'júní',
      'júlí',
      'ágúst',
      'september',
      'október',
      'nóvember',
      'desember',
    ];

    const currentMonth = new Date().getMonth();

    return months[currentMonth];
  }

  public static getTechSpecsTableHTML(specs: Array<TechSpecs>) {
    const markup = '';

    if (!specs || !specs.length) {
      return markup;
    }

    return markup;
  }
}

export default PDFHelpers;
