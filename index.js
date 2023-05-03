const { Client, ActivityType } = require('discord.js');
const bot = new Client({ intents: 33283 });
const { PSClient } = require('./src/packages/discordpps');
const psc = new PSClient({ client: bot, prefix: require('./config/prefixes.json') });

const config = require('./config/config.json');
const { Clanner } = require('./src/classes');

/* login stuff */
bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}`);
	update();
});


/* status updates on message */
bot.on("messageCreate", () => {
	update();
});


/* status updater */
function update() {
	var clans = new Clanner();
	bot.user.setPresence({
		activities: [{
			name: `over ${clans.count()} ${(clans.count() == 1) ? "clan" : "clans" }`,
			type: ActivityType.Watching
		}]
	});
}


/* logs in and sets up the stuff for the commands to work */
bot.login(config.token);
module.exports = { psc, bot };

console.log("===========================================");
console.log(`Build Log :: ${ (new Date()).toISOString() }`);
console.log("===========================================\n");


/* builds the commands */
require('./src/commands/build'); 


/* builds the events */
require('./src/events/build');


console.log("\n===========================================\n");

console.log("Console Outputs:\n");
