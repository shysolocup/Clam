var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji } = require('../assets');

async function data(ctx, cmd) {
	if (cmd.onCooldown) {
		return psc.reply({embeds: [
			new psc.Embed({
				title: "Woah there!  :face_with_spiral_eyes:",
				description: `${declineEmoji} You've been timed out from using this command for a bit.`,
				color: colors.decline
			})
		],
			deleteAfter: "3s"
		});
	}
	
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

psc.command({ name: "create", cooldown: "1m"}, data);
