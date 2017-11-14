import fs from 'fs';
import os from 'os';
import path from 'path';

import * as sourceModule from './cli';

beforeEach(() => {
  console.debug = () => {};
});

