import fs from 'fs';
import os from 'os';
import path from 'path';

import pdf from 'html-pdf';

jest.mock('./loadJSON');

import renderTemplate from './renderTemplate';
import loadJSON from './loadJSON';
import templateToPDF from './templateToPDF';

const htmlContent = '<b>420</b>';

test('Loads template parameters if specified', () => {
  const view = { myvar: 420 };
  templateToPDF(htmlContent, null, view);
  expect(loadJSON).toHaveBeenCalledWith(view);
});

test('Loads PDF settings if specified', () => {
  const settings = { format: 'Letter', orientation: 'landscape' };
  templateToPDF(htmlContent, null, null, settings);
  expect(loadJSON).toHaveBeenCalledWith(settings);
});

test('Returns PDF object for further processing', () => {
  const result = templateToPDF(htmlContent);
  expect(result).toHaveProperty('html', htmlContent);
});

test('Generates html base for input file source', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
  const tmpFile = path.join(tmpDir, 'template.html');
  fs.writeFileSync(tmpFile, htmlContent);
  const result = templateToPDF(tmpFile);
  expect(result)
    .toHaveProperty('options.base', expect.stringMatching(tmpFile));
});

test('Can create new PDF file at location specified', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
  const tmpFile = path.join(tmpDir, 'result.pdf');
  expect.assertions(1);
  return templateToPDF(htmlContent, tmpFile)
    .then(() => expect(fs.existsSync(tmpFile)).toBe(true))
    .catch((error) => { throw error; });
});

test('Throws exception if PDF cannot be written', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
  const tmpFile = path.join(tmpDir, 'result.pdf');
  // Simulate an error during PDF write
  const message = 'Simulated PDF testing error';
  const mockedPDFResult = {
    toFile: (destination, callback) => callback(message, destination),
  };
  pdf.create = jest.fn(() => mockedPDFResult);
  expect.assertions(1);
  return templateToPDF(htmlContent, tmpFile)
    .catch((error) => {
      expect(error).toMatch(message);
      pdf.create.mockReset();
      pdf.create.mockRestore();
    });
});

