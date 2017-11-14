/**
 * Utility functions for parsing templates and generating a PDF file
 */

import fs from 'fs';

import Handlebars from 'handlebars';

import log from './logging';

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
export default (template, variables) => {
  let templateContent;

  if (fs.existsSync(template)) {
    log.verbose(`Loading ${template}`);
    templateContent = fs.readFileSync(template, 'utf8');
  } else {
    templateContent = template;
  }

  log.verbose('Applying template paramters...');
  const render = Handlebars.compile(templateContent);
  const content = render(variables);
  log.verbose('Template rendering complete');

  return content;
};
