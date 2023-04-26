var fs = require('fs');
const path = require('node:path');

const commandPath = path.join(__dirname, '../../commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => (file.endsWith('.js') && file != "index.js"));

var commandCount = 0;

commandFiles.forEach( (file) => {
	require(`../${file}`);
	commandCount++;
});


console.log("\nCommands Built");


var { psc } = require('../../../index.js');
console.log(`\n${psc.commandList.length}/${commandCount} commands done\n`);
