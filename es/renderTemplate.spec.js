'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _renderTemplate = require('./renderTemplate');

var _renderTemplate2 = _interopRequireDefault(_renderTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('Renders from input string', function () {
  var result = (0, _renderTemplate2.default)('<b>{{myvar}}</b>', { myvar: '420' });
  expect(result).toBe('<b>420</b>');
});

test('Renders from existing input file', function () {
  var tmpDir = _fs2.default.mkdtempSync(_path2.default.join(_os2.default.tmpdir(), 'pdfr-'));
  var tmpFile = _path2.default.join(tmpDir, 'template.html');
  _fs2.default.writeFileSync(tmpFile, '<b>{{myvar}}</b>');
  var result = (0, _renderTemplate2.default)(tmpFile, { myvar: '420' });
  expect(result).toBe('<b>420</b>');
});