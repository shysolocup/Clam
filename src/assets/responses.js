var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var responses = new Soup(Object);

const assetPath = path.join(__dirname, '../assets');
const respFiles = fs.readdirSync(assetPath).filter(file => (file.endsWith('responses.json')));

respFiles.forEach( (file) => {
    let name = file.split(" responses.json")[0];
	responses.push(name, require(`./${file}`));
});

module.exports = { responses };
