/**
 * Utility functions for parsing templates and generating a PDF file
 */

import fs from 'fs';
import path from 'path';

import Handlebars from 'handlebars';
import pdf from 'html-pdf';

/**
 * Renders a template using specified template paramters.
 *
 * This implementation uses the Handlebars.js specification for templating.
 * @see http://handlebarsjs.com/
 *
 * @param {string} template - a template file path or raw string template
 * @param {object} variables - template parameters
 *
 * @throws {TypeError} if file cannot be opened
 *
 * @return {string} rendered HTML content with template parameters applied
 */
export function renderTemplate(template, variables) {
  let templateContent;

  if (fs.existsSync(template)) {
    console.debug(`Loading ${template}`);
    templateContent = fs.readFileSync(template, 'utf8');
  } else {
    templateContent = template;
  }

  console.debug('Applying template paramters...');
  const render = Handlebars.compile(templateContent);
  const content = render(variables);
  console.debug('Template rendering complete');

  return content;
}


/**
 * Loads a JSON document from a file or parses it from a string
 *
 * This method is intended to handle various sorts of input:
 *  - an object will just be passed through
 *  - a file name will have its contents loaded so that they can be parsed
 *  - a string will be parsed as JSON
 *
 * @param {object|string} source - JSON source, can be an object, string,
 *                                 or file path
 *
 * @throws {TypeError} if file cannot be opened
 *
 * @return {object} JSON document
 */
export function loadJSON(source) {
  if (typeof source === 'object') {
    return source;
  }

  let content;

  if (typeof source === 'string') {
    if (fs.existsSync(source)) {
      console.debug(`Loading JSON: ${source}`);
      content = fs.readFileSync(source, 'utf8');
    } else {
      content = source;
    }
  } else {
    throw new TypeError([
      'Invalid type for JSON source',
      'Specify either object literal or string or valid file path',
    ].join(''));
  }

  console.debug('Parsing JSON...');
  const json = JSON.parse(content);
  console.debug('Parsing JSON complete');

  return json;
}

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
export function templateToPDF(
  source,
  destination = null,
  context = null,
  settings = null,
) {
  const contextParsed = context ? loadJSON(context) : {};
  const settingsParsed = settings ? loadJSON(settings) : {};

  const htmlContent = renderTemplate(source, contextParsed);

  if (fs.existsSync(source)) {
    settingsParsed.base = `file://${path.resolve(source)}`;
  }

  console.debug('Generating PDF contents');
  const pdfResult = pdf.create(htmlContent, settingsParsed);

  if (destination) {
    return new Promise((resolve, reject) => {
      pdfResult.toFile(destination, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.debug(`PDF written to: ${result.filename}`);
          resolve();
        }
      });
    });
  }

  console.debug('PDF complete');
  return pdfResult;
}

