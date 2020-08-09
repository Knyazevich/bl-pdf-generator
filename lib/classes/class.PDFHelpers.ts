import QRCode from 'qrcode';

class PDFHelpers {
  public static getVariationTablesHTML(tablesData: Array<Array<VariationTableRow>>, assetsPath: string) {
    const oilBasedCars = tablesData[0];
    const ecoCars = tablesData[1];
    let markup = '';

    const oilHeader = `
      <div class="table-container">
        <table class="auto-info-table">
          <thead class="auto-info-table__header">
          <tr class="auto-info-table__header-row">
            <th class="auto-info-table__header-title">Gerð</th>
            <th class="auto-info-table__header-title">Stærð vélar</th>
            <th class="auto-info-table__header-title">Orkugjafi</th>
            <th class="auto-info-table__header-title">Skipting</th>
            <th class="auto-info-table__header-title">Eyðsla</th>
            <th class="auto-info-table__header-title">Hestöfl</th>
            <th class="auto-info-table__header-title">Co2</th>
            <th class="auto-info-table__header-title">Verð</th>
            <th class="auto-info-table__header-title">90% lán*</th>
          </tr>
          </thead>
        
          <tbody class="auto-info-table__main">
    `;

    const ecoHeader = `
      <div class="table-container">
        <table class="auto-info-table">
          <thead class="auto-info-table__header">
          <tr class="auto-info-table__header-row">
            <th class="auto-info-table__header-title">Gerð</th>
            <th class="auto-info-table__header-title">Stærð vélar</th>
            <th class="auto-info-table__header-title">Orkugjafi</th>
            <th class="auto-info-table__header-title">Skipting</th>
            <th class="auto-info-table__header-title">Eyðsla</th>
            <th class="auto-info-table__header-title">Hestöfl</th>
            <th class="auto-info-table__header-title">Drægi</th>
            <th class="auto-info-table__header-title">Verð</th>
            <th class="auto-info-table__header-title">90% lán*</th>
          </tr>
          </thead>
        
          <tbody class="auto-info-table__main">
    `;

    const tableFooter = '</tbody></table></div>';

    if (oilBasedCars.length) {
      markup += oilHeader;

      oilBasedCars.forEach((car: VariationTableRow) => {
        markup += `
        <tr class="auto-info-table__main-row">
          <td class="auto-info-table__main-cell">${this.prepareTitle(car.name)}</td>
          <td class="auto-info-table__main-cell"><span>${car.capacity}</span> cc</td>
          <td class="auto-info-table__main-cell">${car.fuelType}</td>
          <td class="auto-info-table__main-cell">${car.transmission}</td>
          <td class="auto-info-table__main-cell">
           ${car.fuelConsumptionCombined.toString().replace(/\./g, ',')} l/100
          </td>
          <td class="auto-info-table__main-cell">${car.maxPower}</td>
          <td class="auto-info-table__main-cell">${car.co2}</td>
          <td class="auto-info-table__main-cell">${car.price} <span>kr.</span></td>
          <td class="auto-info-table__main-cell"><span>${car.loan}</span></td>
        </tr>
      `;
      });

      markup += tableFooter;
    }

    if (ecoCars.length) {
      markup += ecoHeader;

      ecoCars.forEach((car: VariationTableRow) => {
        markup += `
        <tr class="auto-info-table__main-row">
          <td class="auto-info-table__main-cell">
            <span class="badge eco-badge">
              <img src="${assetsPath}/img/eco-badge.svg" alt="" class="badge-image">
            </span>
            
            ${this.prepareTitle(car.name)}
          </td>
          <td class="auto-info-table__main-cell"><span>${car.capacity}</span> cc</td>
          <td class="auto-info-table__main-cell">${car.fuelType}</td>
          <td class="auto-info-table__main-cell">${car.transmission}</td>
          <td class="auto-info-table__main-cell">
            ${car.fuelConsumptionCombined.toString().replace(/\./g, ',')} l/100
          </td>
          <td class="auto-info-table__main-cell">${car.maxPower}</td>
          <td class="auto-info-table__main-cell">${car.range} km.</td>
          <td class="auto-info-table__main-cell">${car.price} <span>kr.</span></td>
          <td class="auto-info-table__main-cell"><span>${car.loan}</span></td>
        </tr>
      `;
      });

      markup += tableFooter;
    }

    return markup;
  }

  public static getEquipmentHTML(equipment: EquipmentLists, tables: Array<Array<VariationTableRow>>) {
    let markup = '';
    // Check if oil rows exists and use them, otherwise use eco-rows
    const activeTable = tables[0].length ? tables[0] : tables[1];

    // Check if picked array contains rows and use first element's title
    const firstEquipmentTitle = activeTable.length ? this.prepareTitle(activeTable[0].name) : '';

    if (!equipment.collections.length) {
      return markup;
    }

    // let elementsCount = 0;
    //
    // equipment.collections.forEach((collection) => {
    //   elementsCount += collection.list.length;
    // });

    markup += `
    <section class="equipment">
      <h2 class="secondary-title secondary__title--margin">
        <span class="dark-blue">Staðalbúnaður</span>
        <span class="light-blue">${firstEquipmentTitle}</span>
      </h2>

      <div class="list-wrapper">
        <ul class="equipment__list">
    `;

    equipment.collections.forEach((collection) => {
      markup += `<div class="list-category"><h3 class="third-title">${collection.title}</h3>`;

      collection.list.forEach((listElement) => {
        markup += `<li class="equipment__list-item">${listElement}</li>`;
      });

      markup += '</div>';
    });

    markup += `
        </ul>
      </div>
    </section>
    `;

    return markup;
  }

  public static splitModelTitle(title: String) {
    const titleWords = title.split(' ');
    const firstWord = titleWords.shift();
    const otherWords = titleWords.join(' ');

    return [firstWord, otherWords];
  }

  public static getExtraEquipmentHTML(extraEquipment: Array<EquipmentList>) {
    let markup = '';

    if (!extraEquipment.length) {
      return markup;
    }

    const uniqueEquipments = this.getUniqueEquipmentByTitle(extraEquipment);

    if (!uniqueEquipments.length) {
      return markup;
    }

    markup += '<section style="page-break-before: always; page-break-after: always;">';

    uniqueEquipments.forEach((equipmentList) => {
      markup += `
      <article class="extra-in-intens equipment">
        <h2 class="secondary-title secondary__title--margin">
          <span class="dark-blue">Aukalega í</span>
          <span class="light-blue">${this.prepareTitle(equipmentList.title)}</span>
        </h2>

        <div class="list-wrapper">
          <ul class="equipment__list">
            <div class="list-category">
      `;

      equipmentList.list.forEach((listElement) => {
        markup += `<li class="equipment__list-item">${listElement}</li>`;
      });

      markup += `
            </div>
          </ul>
        </div>
      </article>
    `;
    });

    markup += '</section>';

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
     <section class="colors" style="page-break-before: always;">
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

    markup += `
      </ul>
    </section>
    `;

    return markup;
  }

  public static async getQRCode(href: string = '') {
    try {
      const url = `${process.env.MAIN_DOMAIN}${href}`;
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
    let markup = '';

    if (!specs || !specs.length) {
      return markup;
    }

    if (specs.length <= 4) {
      markup += this.generateTable(specs, 0);
    } else {
      const specsChunks = this.chunks(specs, 4);

      specsChunks.forEach((chunk, index) => {
        markup += this.generateTable(chunk, index);
      });
    }

    return markup;
  }

  public static generateTable(specs: Array<TechSpecs>, index: number) {
    let markup = '';
    const isFirstRow = index === 0;

    markup += `
      <div class="table-container ${!isFirstRow ? 'table-container--pt' : ''}"
            style="${(!isFirstRow && index % 2 === 0) ? 'page-break-before: always;' : ''}">
        <table class="technical__table">
          <thead class="technical__table-header technical__table-main-header">
          <tr class="technical__table-main-header-row">
            <th class="technical__table-category-title dark-blue">Vél og afköst</th>
    `;

    specs.forEach((spec) => {
      markup += `
        <th class="technical__table-header-title">
          <span class="dark-blue">${spec.meta}</span>
          <span class="light-blue">${spec.title}</span>
        </th>
      `;
    });

    /* eslint-disable max-len */
    markup += `
         </tr>
        </thead>
        <tbody class="technical__table-body">
          ${this.generateRow(['Eldsneyti', ...specs.map((spec) => spec.engineAndPerformance.fuelType)])}
          ${this.generateRow(['Fjöldi Strokka', ...specs.map((spec) => spec.engineAndPerformance.numberOfCylinders)])}
          ${this.generateRow(['Rúmtak Vélar', ...specs.map((spec) => spec.engineAndPerformance.inductionCapacity)])}
          ${this.generateRow(['Skipting', ...specs.map((spec) => spec.engineAndPerformance.transmission)])}
          ${this.generateRow(['Drifás', ...specs.map((spec) => spec.engineAndPerformance.wheelsDriven)])}
          ${this.generateRow(['Hámarks Hestöfl (Hö)', ...specs.map((spec) => spec.engineAndPerformance.maxPower)])}
          ${this.generateRow(['Hámarks Tog (Nm)', ...specs.map((spec) => spec.engineAndPerformance.maxTorgue)])}
          ${this.generateRow(['Hröðun (0-100 Km/Klst.)', ...specs.map((spec) => spec.engineAndPerformance.acceleration)])}
          ${this.generateRow(['Hámarkshraði', ...specs.map((spec) => spec.engineAndPerformance.maxSpeed)])}
          ${this.generateRow(['Eyðsla og útblástur', ...new Array(specs.length).fill('', 0, specs.length)], true)}
          ${this.generateRow(['Eyðsla WLTP Combined', ...specs.map((spec) => spec.spendingAndExhaust.fuelConsumptionCombined)])}
          ${this.generateRow(['Co2 Gkm', ...specs.map((spec) => spec.spendingAndExhaust.co2)])}
          ${this.generateRow(['Emission Standard', ...specs.map((spec) => spec.spendingAndExhaust.emissionStandard)])}
          ${this.generateRow(['Helstu mál', ...new Array(specs.length).fill('', 0, specs.length)], true)}
          ${this.generateRow(['Heildarlengd', ...specs.map((spec) => new Intl.NumberFormat('de-DE').format(spec.mainIssues.overallLength))])}
          ${this.generateRow(['Heildarbreidd', ...specs.map((spec) => new Intl.NumberFormat('de-DE').format(spec.mainIssues.overallWidth))])}
          ${this.generateRow(['Farangursrými', ...specs.map((spec) => new Intl.NumberFormat('de-DE').format(spec.mainIssues.loadVolumeLitres))])}
          ${this.generateRow(['Farangursrými /Með Sæti Niðri', ...specs.map((spec) => new Intl.NumberFormat('de-DE').format(spec.mainIssues.maximumLoadVolumeLitres))])}
          ${this.generateRow(['Eiginþyngd', ...specs.map((spec) => new Intl.NumberFormat('de-DE').format(spec.mainIssues.ownWeight))])}
          ${this.generateRow(['Heildarþyngd Ökutækis', ...specs.map((spec) => new Intl.NumberFormat('de-DE').format(spec.mainIssues.maxWeight))])}
        </tbody>
      </table>
    </div>
    `;
    /* eslint-enable max-len */

    return markup;
  }

  private static generateRow(data: Array<any>, isHeading?: boolean) {
    const node = isHeading ? 'th' : 'td';
    const rowClass = isHeading ? 'technical__table-category-title dark-blue' : 'technical__table-cell';

    let markup = `<tr class="technical__table-row ${isHeading ? 'technical__table-main-header-row' : ''}">`;

    data.forEach((element) => {
      markup += `<${node} class="${rowClass}">${element}</${node}>`;
    });

    markup += '</tr>';

    return markup;
  }

  private static chunks(array: Array<any>, size: number) {
    const result = [];

    while (array.length) {
      result.push(array.splice(0, size));
    }

    return result;
  }

  private static prepareTitle(carTitle: string) {
    return carTitle.split('-')[0].trim();
  }

  private static getUniqueEquipmentByTitle(equipments: Array<EquipmentList>) {
    const titles: string[] = [];

    return equipments.filter((equipment) => {
      const title = this.prepareTitle(equipment.title);

      if (!titles.includes(title)) {
        titles.push(title);
        return true;
      }

      return false;
    });
  }

  public static async getFooter(data: FooterData) {
    const qr = await PDFHelpers.getQRCode(data.href);
    const year = new Date().getFullYear();
    const month = PDFHelpers.getCurrentMonth();

    return `
      <footer class="inner-footer">
        <div class="product-info">
          <div class="qr-code">
            <img src="${qr}" alt="">
          </div>

          <div class="product-info__desc">
            <h1 class="first-title inner-footer__title inner-footer__title--margin">
              <span class="dark-blue">${data.brandName ? data.brandName.toUpperCase() : ''}</span>
              <span class="light-blue">${data.modelName ? data.modelName.toUpperCase() : ''}</span>
            </h1>
            <div class="product-info__desc-text-box">
              <p class="product-info__desc-text product-info__desc-text--margin">
                Verðlisti ${month} ${year}
              </p>

              <p class="product-info__desc-text product-info__desc-text--margin">
                Skannaðu þennan QR kóða til að fá meiri upplýsingar
              </p>
            </div>
          </div>
        </div>

        <address class="inner-footer__contacts">
          <div class="inner-footer__contacts-box">
            <h2 class="inner-footer__contact-title inner-footer__contact-title--margin">BL ehf.</h2>
            <p class="inner-footer__contact-text inner-footer__contact-text--margin">Sævarhöfða 2 / 110 Reykjavík</p>
            <a class="inner-footer__contact-link" href="tel:525-8000">525-8000</a>
            <span>/</span>
            <a class="inner-footer__contact-link" href="https://www.bl.is">www.bl.is</a>
          </div>
          
          <div class="logo" style="${!data.assetsPath ? 'visibility: hidden;' : ''}">
            <img src="${data.assetsPath}/img/logo.svg" alt="">
          </div>
        </address>
      </footer>
    `;
  }
}

export default PDFHelpers;
