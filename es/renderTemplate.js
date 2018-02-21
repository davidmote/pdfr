'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
exports.default = function (template, variables) {
  var templateContent = void 0;

  if (_fs2.default.existsSync(template)) {
    _logging2.default.verbose('Loading ' + template);
    templateContent = _fs2.default.readFileSync(template, 'utf8');
  } else {
    templateContent = template;
  }

  _logging2.default.verbose('Applying template paramters...');
  var render = _handlebars2.default.compile(templateContent);
  var content = render(variables);
  _logging2.default.verbose('Template rendering complete');

  return content;
}; /**
    * Utility functions for parsing templates and generating a PDF file
    */