'use strict';

const AdmZip = require('adm-zip');
const beautifyHtml = require('js-beautify').html;
const path = require('path');

const unODF = (input, pretty) => {
  const zip = new AdmZip(input);
  const zipEntries = zip.getEntries();

  return zipEntries.reduce((obj, zipEntry) => {
    const entryName = zipEntry.entryName;
    if (path.extname(entryName).toLowerCase() === '.xml' && pretty) {
      obj[entryName] = new Buffer(beautifyHtml(zipEntry.getData().toString('utf8'), {
        indent_size: 2,
        end_with_newline: true
      }));
    } else {
      obj[entryName] = zipEntry.getData();
    }
    return obj;
  }, {});
};

module.exports = unODF;
