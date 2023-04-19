const { Client, ActivityType } = require('discord.js');
const bot = new Client({ intents: 33283 });
const { PSClient } = require('discordpps');
const psc = new PSClient({ client: bot, prefix: "!" });

const config = require('./config/config.json');

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}`);
	bot.user.setPresence({
		activities: [{
			name: `over <count would go here but I haven't added it yet> clans`,
			type: ActivityType.Watching
		}]
	});
});


bot.login(config.token);
