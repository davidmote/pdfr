import fs from 'fs';
import os from 'os';
import path from 'path';

import renderTemplate from './renderTemplate';

test('Renders from input string', () => {
  const result = renderTemplate('<b>{{myvar}}</b>', { myvar: '420' });
  expect(result).toBe('<b>420</b>');
});

test('Renders from existing input file', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
  const tmpFile = path.join(tmpDir, 'template.html');
  fs.writeFileSync(tmpFile, '<b>{{myvar}}</b>');
  const result = renderTemplate(tmpFile, { myvar: '420' });
  expect(result).toBe('<b>420</b>');
});
