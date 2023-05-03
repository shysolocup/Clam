var { psc, bot } = require('../../index.js');
var { colors } = require('../assets');


async function data(ctx) {
	if (ctx.content.includes(`<@${bot.user.id}>`) && ctx.content.toLowerCase().includes("prefix")) {
		let prefixes = require('../../config/prefixes.json');

		let prefix = (prefixes instanceof Object && prefixes[ctx.guild.id]) ?prefixes[ctx.guild.id] : (prefixes instanceof Object) ? prefixes.default : prefixes;

		let embed = new psc.Embed({
            description: `My prefix in this server is ${"`"+prefix+"`"}`,
            color: colors.blurple
        });

        ctx.reply({
            embeds: [embed]
        });
	}
};

psc.event("messageCreate", data);
