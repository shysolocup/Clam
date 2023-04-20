var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji } = require('../assets');

async function data(ctx, cmd) {
	const { Clan } = require('../classes');

	let clan = new Clan(ctx);
	
	const embed = new psc.Embed({
		title: "Clan Creation :sparkles:",
		description: `${acceptEmoji} Created your new clan!`,
		footer: `( id: ${clan.id} )`,
		color: colors.accept
	});

	ctx.reply({ embeds: [embed] });
}

psc.command("create", data);
