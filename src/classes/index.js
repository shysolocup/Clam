var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var classes = new Soup(Object);

const classPath = path.join(__dirname, '../classes');
const classFiles = fs.readdirSync(classPath).filter(file => (file.endsWith('.js') && file != "index.js"));

classFiles.forEach( (file) => {
	let stuff = Soup.from(require(`./${file}`));

	stuff.forEach( (name, data) => { classes.push(name, data); });
});

module.exports = classes.pour();
