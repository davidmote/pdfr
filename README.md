# pdfr

A tool that generates a PDF from an re-usable HTML template


## Background

Several project require PDF report generation with included images and graphs,
such as application validation/verification via automated testing,
templated reports, customized documents, etc. Therefore the need for a service
to automate this workflow is desired.

The component will take a template, render with parameters, apply a set of style
sheets, include images, and output a PDF file.


## Project Goals

* Must include dynamic templates (user should be able to choose template)
* Should be able to update template without having to update software
* Must be able to specify a header and footer
* Must be able to include images
* Must be able to include CSS styling


## Implementation

### Handlebars.js

This tool uses [handlebars.js](http://handlebarsjs.com/) for template rendering.
For documentation about allowed constructs see:

* Expressions: http://handlebarsjs.com/expressions.html
* Blocks: http://handlebarsjs.com/block_helpers.html

### html-pdf

This tool uses [html-pdf](https://github.com/marcbachmann/node-html-pdf) for
generating a PDF from html content.
For more documentation about configuration options, see:

https://github.com/marcbachmann/node-html-pdf#options


## Requirements

* node (carbon)


## Installation

```
  > npm install pdfr
```


## Development

```
  > git clone https://github.com/Codebiosys/pdfr.git
  > cd pdfr
  > npm install yarn && yarn
  > yarn link
```

Remember to run `yarn link` so that the command line script is properly
installed for testing during development
