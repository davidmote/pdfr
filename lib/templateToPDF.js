/**
 * Utility functions for parsing templates and generating a PDF file
 */

import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';

import loadJSON from './loadJSON';
import log from './logging';
import renderTemplate from './renderTemplate';

/**
 * Runs the full stack of template file to PDF file
 *
 * This method is intented to be able to handle various types of inputs.
 * Typically, in a microservice scenario it will be expected to handle
 * file names whereas in an API scenario it will handle string buffers. In
 * the case of handling a file path source, it will try to specify the
 * <base /> so that all the assets can load properly.
 *
 * @see http://handlebarsjs.com/
 * @see https://github.com/marcbachmann/node-html-pdf
 *
 * @throws {TypeError} if any file cannot be opened
 *
 * @param {string} source - file path or string template source
 * @param {string} [destination] - file path destination to write PDF contents
 * @param {string|object} [context] - file path or JSON document of template
 *                                    parameters
 * @param {string|object} [settings] - file path or JSON document of PDF
 *                                     configurationo
 *
 * @return {Promise|object} PDF object that can be further piped and processed.
 *                          If a destination is specified, a promise is
 *                          returned that resolved when the file is written.
 */
export default (
  source,
  destination = null,
  context = null,
  settings = null,
) => {
  const contextParsed = context ? loadJSON(context) : {};
  const settingsParsed = settings ? loadJSON(settings) : {};

  const htmlContent = renderTemplate(source, contextParsed);

  if (fs.existsSync(source)) {
    settingsParsed.base = `file://${path.resolve(source)}`;
  }

  log.verbose('Generating PDF contents');
  const pdfResult = pdf.create(htmlContent, settingsParsed);

  if (destination) {
    return new Promise((resolve, reject) => {
      pdfResult.toFile(destination, (error, result) => {
        if (error) {
          log.error(error);
          reject(error);
        } else {
          log.verbose(`PDF written to: ${result.filename}`);
          resolve();
        }
      });
    });
  }

  log.verbose('PDF complete');
  return pdfResult;
};
