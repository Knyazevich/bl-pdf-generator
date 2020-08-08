import puppeteer, { Browser } from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import Logger from './class.Logger';
import PDFHelpers from './class.PDFHelpers';

const { readFile } = fs.promises;

const path = require('path');

class ModelPDF {
  private readonly TEMPLATE_PATH: string;

  private browser: Browser;

  private data: {};

  constructor() {
    this.TEMPLATE_PATH = './lib/templates/index.hbs';
    this.browser = null;
    this.data = {};
  }

  public async registerTemplateHelpers() {
    try {
      Handlebars.registerHelper('uppercase', (string) => {
        if (string && typeof string === 'string') {
          return string.toUpperCase();
        }

        return '';
      });

      Handlebars.registerHelper('capitalize', (string) => {
        if (string && typeof string === 'string') {
          return string[0].toUpperCase() + string.slice(1).toLowerCase();
        }

        return '';
      });
    } catch (e) {
      Logger.log('error', e);
    }
  }

  /**
   * Compile the handlebars template to an HTML string.
   *
   * @param templateName
   * @param data
   * @return {string} Template's HTML
   */
  public async compileTemplate(templateName: string, data: Payload) {
    const filePath = path.join(process.cwd(), templateName);
    const template = await readFile(filePath, 'utf-8');
    const qr = await PDFHelpers.getQRCode(data.href);
    const assetsPath = `http://${process.env.HOST}:${process.env.PORT}/public/assets`;
    await this.registerTemplateHelpers();

    return Handlebars.compile(template)({
      ...data,
      assetsPath,
      variationTables: PDFHelpers.getVariationTablesHTML(data.tables, assetsPath),
      equipmentLists: PDFHelpers.getEquipmentHTML(data.equipment, data.tables),
      extraEquipmentLists: PDFHelpers.getExtraEquipmentHTML(data.extraEquipment),
      techSpecsTable: PDFHelpers.getTechSpecsTableHTML(data.techSpecsList),
      colors: PDFHelpers.getColorsHTML(data.colors),
      qr,
      year: new Date().getFullYear(),
      month: PDFHelpers.getCurrentMonth(),
    });
  }

  /**
   * Initialize puppeteer and create a page.
   *
   * @return {!Promise<!Puppeteer.Page>}
   */
  private async createPage() {
    this.browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    return this.browser.newPage();
  }

  private async closePage() {
    await this.browser.close();
  }

  public async generate(data: any) {
    try {
      let content = await this.compileTemplate(this.TEMPLATE_PATH, data);
      const page = await this.createPage();

      content = content.replace(/null/gm, '‒');

      await page.setViewport({
        width: 2480,
        height: 3508,
        deviceScaleFactor: 1,
      });

      await page.setContent(content);
      await page.emulateMediaType('print');
      await page.goto(`data:text/html,${content}`, { waitUntil: 'networkidle2' });

      const buffer = await page.pdf({
        format: 'A4',
        landscape: false,
        scale: 0.5,
        printBackground: true,
      });

      await this.closePage();

      return buffer;
    } catch (e) {
      Logger.log('error', e);
    }
  }
}

export default ModelPDF;
