const { Client, ActivityType, AttachmentBuilder } = require("discord.js");
const bot = new Client({ intents: 33283 });
const { PSClient } = require('discordpps');
const psc = new PSClient({ client: bot, prefix: "!" });

var { ClanManager } = require('./Managers/ClanManager.js');
var { EconomyManager } = require('./Managers/EconomyManager.js');
var clanManager = new ClanManager;
var econManager = new EconomyManager;

const { Stew } = require('stews');
const fetch = require('node-fetch');
const fs = require("fs");

var config = require('./config.json');
var clans = require('./clans.json');
var econ = require('./econ.json');

var theTRueEpic = "500714808912642048";
var theEpic = config.theEpic;
var pearl = "🔘";
var decline = "<:decline:1052011672774131762>";
var confirm = "<:confirm:1052011206891798618>";

var infostuffs = new Stew('map');


/* Ready */

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}\n`);
	bot.user.setPresence({
		activities: [{
			name: `over ${clanManager.count(clans)} clans`,
			type: ActivityType.Watching
		}]
	});
});


/* Commands */

var { commands } = require('./Commands');

console.log(commands);

/* Economy */
psc.command( {name: "balance", aliases: ["bal"]}, async (ctx, cmd) => commands.balance(ctx, cmd));

/* Main */
psc.command( {name: "help"}, async (ctx, cmd) => commands.help(ctx, cmd));
psc.command( {name: "export"}, async (ctx, cmd) => commands.export(ctx, cmd));
psc.command( {name: "import"}, async (ctx, cmd) => commands.import(ctx, cmd));

/* Button Actions */
psc.buttonAction( (ctx) => {
	/* help menu */
});

bot.login(config.token);


module.exports = { psc, bot, clanManager, econManager, fetch, fs, clans, theTRueEpic, theEpic, pearl, decline, confirm, infostuffs, commands, AttachmentBuilder }
