// import fs from 'fs';
// import os from 'os';
// import path from 'path';
//
// import pdf from 'html-pdf';
//
// import * as util from './util';
//
// beforeEach(() => {
//   console.debug = () => {};
// });
//
// describe('Template rendering', () => {
//   const { renderTemplate } = util;
//
//   test('Renders from input string', () => {
//     const result = renderTemplate('<b>{{myvar}}</b>', { myvar: '420' });
//     expect(result).toBe('<b>420</b>');
//   });
//
//   test('Renders from existing input file', () => {
//     const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
//     const tmpFile = path.join(tmpDir, 'template.html');
//     fs.writeFileSync(tmpFile, '<b>{{myvar}}</b>');
//     const result = renderTemplate(tmpFile, { myvar: '420' });
//     expect(result).toBe('<b>420</b>');
//   });
// });
//
// describe('JSON loading', () => {
//   const { loadJSON } = util;
//
//   test('Ignores already parsed objects', () => {
//     const doc = { myvar: 420 };
//     const result = loadJSON(doc);
//     expect(result).toEqual(doc);
//   });
//
//   test('Renders from input string', () => {
//     const doc = { myvar: 420 };
//     const result = loadJSON(JSON.stringify(doc));
//     expect(result).toEqual(doc);
//   });
//
//   test('Renders from existing input file', () => {
//     const doc = { myvar: 420 };
//     const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
//     const tmpFile = path.join(tmpDir, 'view.json');
//     fs.writeFileSync(tmpFile, JSON.stringify(doc));
//     const result = loadJSON(tmpFile);
//     expect(result).toEqual(doc);
//   });
//
//   test('Throws error on invalid input type', () => {
//     const shouldThrow = () => loadJSON(420);
//     expect(shouldThrow).toThrow(/invalid type/i);
//   });
// });
//
// describe('PDF generating', () => {
//   const { templateToPDF } = util;
//   const htmlContent = '<b>420</b>';
//
//   // beforeEach(() => {
//   // util['loadJSON'] = jest.fn();
//   // util.renderTemplate = jest.fn(() => htmlContent);
//   // });
//
//   test.only('Loads template parameters if specified', () => {
//     console.log(util);
//     const spy = jest.spyOn(util, 'loadJSON').mockImplementation(stuff => ({ myvar: 'omfg' }));
//     const view = { myvar: 420 };
//     util.templateToPDF(htmlContent, null, view);
//     console.log(util);
//
//     // console.log(spy.mock.calls);
//     expect(spy).toHaveBeenCalledWith(view);
//     // expect(util.loadJSON).toHaveBeenCalledWith(view);
//   });
//
//   test('Returns PDF object for further processing', () => {
//     const result = templateToPDF(htmlContent);
//     expect(result).toHaveProperty('html', htmlContent);
//   });
//
//   test('Generates html base for input file source', () => {
//     const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
//     const tmpFile = path.join(tmpDir, 'template.html');
//     fs.writeFileSync(tmpFile, htmlContent);
//     const result = templateToPDF(tmpFile);
//     expect(result)
//       .toHaveProperty('options.base', expect.stringMatching(tmpFile));
//   });
//
//   test('Can create new PDF file at location specified', () => {
//     const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
//     const tmpFile = path.join(tmpDir, 'result.pdf');
//     expect.assertions(1);
//     return templateToPDF(htmlContent, tmpFile)
//       .then(() => expect(fs.existsSync(tmpFile)).toBe(true))
//       .catch((error) => { throw error; });
//   });
//
//   test('Throws exception if PDF cannot be written', () => {
//     const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
//     const tmpFile = path.join(tmpDir, 'result.pdf');
//     // Simulate an error during PDF write
//     const mockedPDFResult = {
//       toFile: (destination, callback) => callback('ERROR', destination),
//     };
//     pdf.create = jest.fn(() => mockedPDFResult);
//     expect.assertions(1);
//     return templateToPDF(htmlContent, tmpFile)
//       .catch(error => expect(error).toMatch('ERROR'));
//   });
// });
