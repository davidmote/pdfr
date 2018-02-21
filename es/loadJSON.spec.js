'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loadJSON = require('./loadJSON');

var _loadJSON2 = _interopRequireDefault(_loadJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('Ignores already parsed objects', function () {
  var doc = { myvar: 420 };
  var result = (0, _loadJSON2.default)(doc);
  expect(result).toEqual(doc);
});

test('Renders from input string', function () {
  var doc = { myvar: 420 };
  var result = (0, _loadJSON2.default)(JSON.stringify(doc));
  expect(result).toEqual(doc);
});

test('Renders from existing input file', function () {
  var doc = { myvar: 420 };
  var tmpDir = _fs2.default.mkdtempSync(_path2.default.join(_os2.default.tmpdir(), 'pdfr-'));
  var tmpFile = _path2.default.join(tmpDir, 'view.json');
  _fs2.default.writeFileSync(tmpFile, JSON.stringify(doc));
  var result = (0, _loadJSON2.default)(tmpFile);
  expect(result).toEqual(doc);
});

test('Throws error on invalid input type', function () {
  var shouldThrow = function shouldThrow() {
    return (0, _loadJSON2.default)(420);
  };
  expect(shouldThrow).toThrow(/invalid type/i);
});