jest.mock('../lib');

import main from './cli';
import * as lib from '../src';

test('Help is called when specified via -h', () => {
  main(['node', '/path/to/pdfr', '-h']);
  expect(lib.log.info).toHaveBeenCalledWith(expect.stringMatching(/usage/i));
});

test('Log level can be configured via -v', () => {
  main(['node', '/path/to/pdfr', '-v']);
  expect(lib.log.level).toBe('verbose');
});

test('API method is called at least with a source and destination path', () => {
  const source = '/path/to/source.html';
  const destination = '/path/to/destination.pdf';
  main(['node', '/path/to/pdfr', source, destination]);
  expect(lib.templateToPDF).toHaveBeenCalledWith(source, destination, null, null);
});

test('API can be passed PDF settings', () => {
  const source = '/path/to/source.html';
  const destination = '/path/to/destination.pdf';
  const settings = '/path/to/settings.json';
  main(['node', '/path/to/pdfr', '-c', settings, source, destination]);
  expect(lib.templateToPDF).toHaveBeenCalledWith(source, destination, null, settings);
});

test('API can be passed JSON template parameters', () => {
  const source = '/path/to/source.html';
  const destination = '/path/to/destination.pdf';
  const view = '/path/to/view.json';
  main(['node', '/path/to/pdfr', '-p', view, source, destination]);
  expect(lib.templateToPDF).toHaveBeenCalledWith(source, destination, view, null);
});
