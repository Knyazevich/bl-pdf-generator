// import puppeteer, { Browser } from 'puppeteer';
// // @ts-ignore
// import * as hbs from 'handlebars';
//
// const fs = require('fs-extra');
// const path = require('path');
//
// class ModelPDF {
//   private TEMPLATE_PATH: string;
//
//   private browser: Browser;
//
//   private data: {};
//
//   constructor() {
//     this.TEMPLATE_PATH = './lib/templates/index.hbs';
//     this.browser = null;
//     this.data = {};
//   }
//
//   /**
//    * Compile the handlebars template to an HTML string.
//    *
//    * @param templateName
//    * @param data
//    * @return {string} Template's HTML
//    */
//   async compileTemplate(templateName: string, data: {}) {
//     const filePath = path.join(process.cwd(), templateName);
//     const template = fs.readFile(filePath, 'utf-8');
//     return hbs.compile(template)(data);
//   }
//
//   /**
//    * Initialize puppeteer and create a page.
//    *
//    * @return {!Promise<!Puppeteer.Page>}
//    */
//   async createPage() {
//     this.browser = await puppeteer.launch();
//     // @ts-ignore
//     return await this.browser.newPage();
//   }
//
//   closePage() {
//     // @ts-ignore
//     this.browser.close();
//   }
//
//   async generate() {
//     try {
//       const content = await this.compileTemplate(this.TEMPLATE_PATH, this.data);
//       const page = await this.createPage();
//
//       await page.setContent(content);
//       // @ts-ignore
//       await page.emulateMedia('screen');
//       await page.goto(`data:text/html,${content}`, {
//         waitUntil: 'networkidle0',
//       });
//
//       const byteArray = await page.pdf({
//         format: 'A4',
//         landscape: false,
//         scale: 1.29,
//         printBackground: true,
//       });
//
//       // @ts-ignore
//       const buffer = Buffer.from(byteArray, 'binary');
//
//       this.closePage();
//
//       return buffer;
//     } catch (e) {
//
//     }
//   }
// }
//
// module.exports = ModelPDF;


// (async () => {
//   /***
//    * The value being passed to the template for handlebar to
//    * compile the template and give the html string.
//    */
//   let data = {message: "This is a test message"};
//   let fileName = 'temp.pdf';
//
//   let buffer = await generatePDFByteArray({data});
//   console.log('got the byte buffer');
//
//   console.log('Opening file and writing the buffer to it');
//   let handle = await fs.open(fileName, 'w');
//   await fs.write(handle, buffer, 0, buffer.length);
//   await fs.close(handle);
//   console.log('writing done');
//
//   console.log('Please check the ', fileName);
// })();
