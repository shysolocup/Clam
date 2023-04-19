const { Client, ActivityType } = require('discord.js');
const bot = new Client({ intents: 33283 });
const { PSClient } = require('discordpps');
const psc = new PSClient({ client: bot, prefix: "!" });

const config = require('./config/config.json');

bot.login(config.token);
