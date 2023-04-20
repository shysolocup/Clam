var fs = require('fs');
const path = require('node:path');

const commandPath = path.join(__dirname, '../../commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => (file.endsWith('.js') && file != "index.js"));

commandFiles.forEach( (file) => {
	require(`../${file}`).data;
});
