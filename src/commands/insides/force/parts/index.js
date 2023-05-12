var fs = require('fs');
const path = require('node:path');
const { Soup } = require('stews');

var insides = new Soup(Object);

const insidesPath = path.join(__dirname, '../parts');
const insidesFiles = fs.readdirSync(insidesPath).filter(file => (file.endsWith('.js') && file != "index.js"));

insidesFiles.forEach( (file) => {
	var stuff = Soup.from(require(`./${file}`));
	insides.push(stuff.name, stuff.data);
});

insides.push("parts", [ 
	"set", 
	"ban",
	"unban",
	"op",
	"deop",
	"withdraw",
	"disband",
	"join",
	"kick",
	"ban",
	"shout",
	"transfer"
]);

module.exports = insides.pour();
