'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlPdf = require('html-pdf');

var _htmlPdf2 = _interopRequireDefault(_htmlPdf);

var _loadJSON = require('./loadJSON');

var _loadJSON2 = _interopRequireDefault(_loadJSON);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

var _renderTemplate = require('./renderTemplate');

var _renderTemplate2 = _interopRequireDefault(_renderTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
/**
 * Utility functions for parsing templates and generating a PDF file
 */

exports.default = function (source) {
  var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var contextParsed = context ? (0, _loadJSON2.default)(context) : {};
  var settingsParsed = settings ? (0, _loadJSON2.default)(settings) : {};

  var htmlContent = (0, _renderTemplate2.default)(source, contextParsed);

  if (_fs2.default.existsSync(source)) {
    settingsParsed.base = 'file://' + _path2.default.resolve(source);
  }

  _logging2.default.verbose('Generating PDF contents');
  var pdfResult = _htmlPdf2.default.create(htmlContent, settingsParsed);

  if (destination) {
    return new Promise(function (resolve, reject) {
      pdfResult.toFile(destination, function (error, result) {
        if (error) {
          _logging2.default.error(error);
          reject(error);
        } else {
          _logging2.default.verbose('PDF written to: ' + result.filename);
          resolve();
        }
      });
    });
  }

  _logging2.default.verbose('PDF complete');
  return pdfResult;
};