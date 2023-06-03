var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var stuff = new Soup(Object);

const dataPath = path.join(__dirname, '../data');
const dataFiles = fs.readdirSync(dataPath).filter(file => (file.endsWith('.json') && file != "index.js"));

dataFiles.forEach( (file) => {
	let name = file.split(".json")[0];
	stuff.push(name, require(`./${file}`));
});

module.exports = stuff.pour();
