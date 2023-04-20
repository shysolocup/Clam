const { Client, ActivityType } = require('discord.js');
const bot = new Client({ intents: 33283 });
const { PSClient } = require('./src/packages/discordpps');
const psc = new PSClient({ client: bot, prefix: "!" });

const config = require('./config/config.json');
const { Clanner } = require('./src/classes');
const clans = new Clanner();

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


/* builds the commands */
require('./src/commands/build'); 


/* builds the events */
require('./src/events/build'); 
