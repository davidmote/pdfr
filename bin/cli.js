#!/usr/bin/env babel-node --

/**
 * Command-line interface to PDFr functions.
 *
 * The intention of this script is to be callable from some deamon services
 * such as a dedicated Docker microservice
 */

import path from 'path';

import minimist from 'minimist';

import { templateToPDF } from '../lib/';

/**
 * Help message printer
 *
 * @param {string[]} argv - command line arguments, usually from 'process.argv'
 */
export function help(argv) {
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

  console.log(message);
  process.exit();
}

/**
 * Main driver function. Prints help() if no paramters or help specified.
 *
 * @param {string[]} argv - command line arguments, usually from 'process.argv'
 */
export default function main(argv) {
  const userParameters = minimist(argv.slice(2));

  if (!userParameters || userParameters.h || userParameters.help) {
    help(argv);
  }

  const {
    _: [sourcePath, destinationPath],
    c: pdfSettingsPath = null,
    p: contextPath = null,
    v: verbose,
  } = userParameters;

  if (verbose) {
    console.debug = (...args) => console.log.apply(null, args);
  }

  templateToPDF(sourcePath, destinationPath, contextPath, pdfSettingsPath);
}

if (require.main === module) {
  main(process.argv);
}
