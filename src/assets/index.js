var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var assets = new Soup(Object);

const assetPath = path.join(__dirname, '../assets');
const assetFiles = fs.readdirSync(assetPath).filter(file => (file.endsWith('.js') || file.endsWith('.json') && file != "index.js"));

assetFiles.forEach( (file) => {
	var stuff = Soup.from(require(`./${file}`));
	if (file.endsWith('.js') {
		stuff.forEach( (name, data) => { assets.push(name, data); });
	}
	else if (file.endsWith('.json')) {
		assets.push(stuff);
	}
});

module.exports = assets.pour();
