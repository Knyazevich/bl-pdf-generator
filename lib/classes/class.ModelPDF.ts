import puppeteer, { Browser } from 'puppeteer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import Logger from './class.Logger';

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

  /**
   * Compile the handlebars template to an HTML string.
   *
   * @param templateName
   * @param data
   * @return {string} Template's HTML
   */
  public async compileTemplate(templateName: string, data: {}) {
    const filePath = path.join(process.cwd(), templateName);
    const template = await readFile(filePath, 'utf-8');
    return hbs.compile(template)({
      ...data,
      assetsPath: `http://${process.env.HOST}:${process.env.PORT}/public/assets`,
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
      const content = await this.compileTemplate(this.TEMPLATE_PATH, data);
      const page = await this.createPage();

      await page.setViewport({
        width: 2480,
        height: 3508,
        deviceScaleFactor: 1,
      });

      console.log(page.viewport());

      await page.setContent(content);
      // @ts-ignore
      page.emulateMedia('print');
      await page.goto(`data:text/html,${content}`, { waitUntil: 'load' });
      const buffer = await page.pdf({
        format: 'A4',
        // width: 2480,
        // height: 3508,
        landscape: false,
        scale: 0.5,
        printBackground: true,
        // displayHeaderFooter: true,
        // headerTemplate: header,
        // footerTemplate: footer,
      });

      this.closePage();

      return buffer;
    } catch (e) {
      const l = new Logger();
      l.log('error', e);
    }
  }
}

export default ModelPDF;
