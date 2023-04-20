var fs = require('fs');
const path = require('node:path');

const eventPath = path.join(__dirname, '../../events');
const eventFiles = fs.readdirSync(eventPath).filter(file => (file.endsWith('.js') && file != "index.js"));

eventFiles.forEach( (file) => {
	require(`../${file}`);
});
