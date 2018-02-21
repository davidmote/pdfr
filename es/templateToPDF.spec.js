'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlPdf = require('html-pdf');

var _htmlPdf2 = _interopRequireDefault(_htmlPdf);

var _loadJSON = require('./loadJSON');

var _loadJSON2 = _interopRequireDefault(_loadJSON);

var _templateToPDF = require('./templateToPDF');

var _templateToPDF2 = _interopRequireDefault(_templateToPDF);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('./loadJSON');

var htmlContent = '<b>432</b>';

test('Loads template parameters if specified', function () {
  var view = { myvar: 432 };
  (0, _templateToPDF2.default)(htmlContent, null, view);
  expect(_loadJSON2.default).toHaveBeenCalledWith(view);
});

test('Loads PDF settings if specified', function () {
  var settings = { format: 'Letter', orientation: 'landscape' };
  (0, _templateToPDF2.default)(htmlContent, null, null, settings);
  expect(_loadJSON2.default).toHaveBeenCalledWith(settings);
});

test('Returns PDF object for further processing', function () {
  var result = (0, _templateToPDF2.default)(htmlContent);
  expect(result).toHaveProperty('html', htmlContent);
});

test('Generates html base for input file source', function () {
  var tmpDir = _fs2.default.mkdtempSync(_path2.default.join(_os2.default.tmpdir(), 'pdfr-'));
  var tmpFile = _path2.default.join(tmpDir, 'template.html');
  _fs2.default.writeFileSync(tmpFile, htmlContent);
  var result = (0, _templateToPDF2.default)(tmpFile);
  expect(result).toHaveProperty('options.base', expect.stringMatching(tmpFile));
});

test('Can create new PDF file at location specified', function () {
  var tmpDir = _fs2.default.mkdtempSync(_path2.default.join(_os2.default.tmpdir(), 'pdfr-'));
  var tmpFile = _path2.default.join(tmpDir, 'result.pdf');
  expect.assertions(1);
  return (0, _templateToPDF2.default)(htmlContent, tmpFile).then(function () {
    return expect(_fs2.default.existsSync(tmpFile)).toBe(true);
  }).catch(function (error) {
    throw error;
  });
});

test('Throws exception if PDF cannot be written', function () {
  var tmpDir = _fs2.default.mkdtempSync(_path2.default.join(_os2.default.tmpdir(), 'pdfr-'));
  var tmpFile = _path2.default.join(tmpDir, 'result.pdf');
  // Simulate an error during PDF write
  var message = 'Simulated PDF testing error';
  var mockedPDFResult = {
    toFile: function toFile(destination, callback) {
      return callback(message, destination);
    }
  };
  _htmlPdf2.default.create = jest.fn(function () {
    return mockedPDFResult;
  });
  expect.assertions(1);
  return (0, _templateToPDF2.default)(htmlContent, tmpFile).catch(function (error) {
    expect(error).toMatch(message);
    _htmlPdf2.default.create.mockReset();
    _htmlPdf2.default.create.mockRestore();
  });
});