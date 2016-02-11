'use strict';

const AdmZip = require('adm-zip');
const beautifyHtml = require('js-beautify').html;
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const unODF = (filePath, outDir, pretty) => {
  const folder = path.join(outDir || '', path.basename(filePath, filePath.slice(filePath.lastIndexOf('.'))));
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();

  mkdirp.sync(folder);

  zipEntries.forEach(zipEntry => {
    const entryName = zipEntry.entryName;
    if (entryName.includes('/')) {
      mkdirp.sync(path.join(folder, entryName.slice(0, entryName.lastIndexOf('/'))));
    }
    if (entryName.slice(entryName.lastIndexOf('.') + 1).toLowerCase() === 'xml' && pretty !== false) {
      fs.writeFileSync(path.join(folder, entryName), beautifyHtml(zipEntry.getData().toString('utf8'), {
        indent_size: 2,
        end_with_newline: true
      }));
    } else {
      fs.writeFileSync(path.join(folder, entryName), zipEntry.getData());
    }
  });
};

module.exports = unODF;
