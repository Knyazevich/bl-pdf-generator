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
      Logger.log('error', `Error while registering template helpers: ${e}`);
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
    const assetsPath = `http://${process.env.HOST}:${process.env.PORT}/public/assets`;
    const footer = await PDFHelpers.getFooter({
      href: data.href,
      brandName: data.brandName,
      modelName: data.modelName,
      assetsPath,
    });

    await this.registerTemplateHelpers();

    return Handlebars.compile(template)({
      ...data,
      assetsPath,
      variationTables: PDFHelpers.getVariationTablesHTML(data.tables, assetsPath),
      equipmentLists: PDFHelpers.getEquipmentHTML(data.equipment, data.tables),
      extraEquipmentLists: PDFHelpers.getExtraEquipmentHTML(data.extraEquipment),
      techSpecsTable: PDFHelpers.getTechSpecsTableHTML(data.techSpecsList),
      colors: PDFHelpers.getColorsHTML(data.colors),
      footer,
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
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      return this.browser.newPage();
    } catch (e) {
      Logger.log('error', `Error while creating Puppeteer page: ${e}`);
    }
  }

  private async closePage() {
    try {
      await this.browser.close();
    } catch (e) {
      Logger.log('error', `Error while closing Puppeteer page: ${e}`);
    }
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
      Logger.log('error', `Error while generating PDF: ${e}`);
    }
  }
}

export default ModelPDF;
