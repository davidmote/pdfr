/**
 * Utility functions for parsing templates and generating a PDF file
 */

import fs from 'fs';
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
export default (source) => {
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
};
