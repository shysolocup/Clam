var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var stuff = new Soup(Object);

const configPath = path.join(__dirname, '../config');
const configFiles = fs.readdirSync(configPath).filter(file => (file.endsWith('.json') && file != "index.js"));

configFiles.forEach( (file) => {
	let name = file.split(".json")[0];
	stuff.push(name, require(`./${file}`));
});

module.exports = stuff.pour();
