const { readFileSync, writeFileSync } = require('fs');
const data = readFileSync('./text.xml', 'utf8');

// ---- Rust

// const { parseXml } = require('/home/leehpeter/projects/work/booklet-xml-parser/converter');
// const parsed = parseXml(data);
// writeFileSync('./ours.json', JSON.stringify(parsed));

// ----  Fast-XML-Parser

const { XMLParser } = require('fast-xml-parser');

const options = {
  allowBooleanAttributes: true,
  preserveOrder: true,
  parseAttributeValue: true,
  parseTagValue: true,
  ignoreAttributes: false,
  trimValues: true,
};
const parser = new XMLParser(options);
let parsed = parser.parse(data);
// writeFileSync('./fast-xml-parser.json', JSON.stringify(parsed));

// ---- XML-JS

// const convert = require('xml-js');

// const parsed = convert.xml2js(data, {
//   compact: false,
//   trim: true,
//   nativeType: true,
//   alwaysArray: true,
//   alwaysChildren: true,
//   nativeTypeAttributes: true,
// });
// writeFileSync('./xml-js.json', JSON.stringify(parsed));

// ---- XML2JS

// const xml2js = require('xml2js');
// let output;
// const parser = new xml2js.Parser({
//   explicitChildren: true,
//   preserveChildrenOrder: true,
//   explicitArray: true,
//   includeWhiteChars: true,
// });
// parser.parseString(data, (_err, xmlResult) => {
//   output = xmlResult;
// });
// writeFileSync('./xml2js.json', JSON.stringify(output));

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`mem: ${Math.round(used * 100) / 100} MB`);
