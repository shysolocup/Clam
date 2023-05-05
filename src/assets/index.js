var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var assets = new Soup(Object);

const assetPath = path.join(__dirname, '../assets');
const assetFiles = fs.readdirSync(assetPath).filter(file => (file.endsWith('.js') && file != "index.js"));

assetFiles.forEach( (file) => {
	var stuff = Soup.from(require(`./${file}`));
	stuff.forEach( (name, data) => { assets.push(name, data); });
});

module.exports = assets.pour();
