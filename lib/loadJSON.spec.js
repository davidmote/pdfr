import fs from 'fs';
import os from 'os';
import path from 'path';

import loadJSON from './loadJSON';

beforeEach(() => {
  console.debug = () => {};
});

describe('JSON loading', () => {
  test('Ignores already parsed objects', () => {
    const doc = { myvar: 420 };
    const result = loadJSON(doc);
    expect(result).toEqual(doc);
  });

  test('Renders from input string', () => {
    const doc = { myvar: 420 };
    const result = loadJSON(JSON.stringify(doc));
    expect(result).toEqual(doc);
  });

  test('Renders from existing input file', () => {
    const doc = { myvar: 420 };
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfr-'));
    const tmpFile = path.join(tmpDir, 'view.json');
    fs.writeFileSync(tmpFile, JSON.stringify(doc));
    const result = loadJSON(tmpFile);
    expect(result).toEqual(doc);
  });

  test('Throws error on invalid input type', () => {
    const shouldThrow = () => loadJSON(420);
    expect(shouldThrow).toThrow(/invalid type/i);
  });
});
