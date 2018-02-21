'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Utility functions for parsing templates and generating a PDF file
                                                                                                                                                                                                                                                                               */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.default = function (source) {
  if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object') {
    return source;
  }

  var content = void 0;

  if (typeof source === 'string') {
    if (_fs2.default.existsSync(source)) {
      _logging2.default.verbose('Loading JSON: ' + source);
      content = _fs2.default.readFileSync(source, 'utf8');
    } else {
      content = source;
    }
  } else {
    throw new TypeError(['Invalid type for JSON source', 'Specify either object literal or string or valid file path'].join(''));
  }

  _logging2.default.verbose('Parsing JSON...');
  var json = JSON.parse(content);
  _logging2.default.verbose('Parsing JSON complete');

  return json;
};