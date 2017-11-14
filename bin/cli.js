#!/usr/bin/env babel-node --

/**
 * Command-line interface to PDFr functions.
 *
 * The intention of this script is to be callable from some deamon services
 * such as a dedicated Docker microservice
 */

import path from 'path';

import minimist from 'minimist';

import { log, templateToPDF } from '../lib/';

/**
 * Main driver function. Prints help() if no paramters or help specified.
 *
 * @param {string[]} argv - command line arguments, usually from 'process.argv'
 */
export default function main(argv) {
  const userParameters = minimist(argv.slice(2));

  if (!userParameters || userParameters.h || userParameters.help) {
    const appName = path.basename(argv[1]);
    const message = [
      'Generates a PDF from an input HTML template with optional parameters.',
      '',
      `Usage: ${appName} [-c <pdf-settings>] [-p <template-variables>] <source> <destination>`,
      '',
      'Examples:',
      `${appName} /path/to/source.tpl.html /path/to/destination.pdf`,
      `${appName} -p context.json /path/to/source.tpl.html /path/to/destination.pdf`,
      `${appName} -c settings.json  -p context.json /path/to/source.tpl.html /path/to/destination.pdf`,
    ].join('\n');

    log.info(message);
    process.exitCode = 1;
    return;
  }

  const {
    _: [sourcePath, destinationPath],
    c: pdfSettingsPath = null,
    p: contextPath = null,
    v: verbose,
  } = userParameters;

  if (verbose) {
    log.level = 'verbose';
  }

  templateToPDF(sourcePath, destinationPath, contextPath, pdfSettingsPath);
}

// Ignore CLI entry-point as this will only work when invoked directly as script
/* istanbul ignore next */
if (require.main === module) {
  main(process.argv);
}
