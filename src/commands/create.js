var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji } = require('../assets');

const { Soup } = require('stews');


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
	let attachments = Soup.from(ctx.attachments);

	
	/* clan info stuff */
	let name = cmd.args.join(" ");
	let icon = attachments[0];
	let banner = attachments[1];
	
	let clan = new Clan(ctx, name, icon, banner);
	
	const embed = new psc.Embed({
		title: "Clan Creation :sparkles:",
		description: `${acceptEmoji} Created ${ (name) ? " `" + name + "`" : "your new clan"}!`,
		footer: `( id: ${clan.id} )`,
		color: colors.accept
	});

	ctx.reply({ embeds: [embed] });
}

psc.command({ name: "create", cooldown: "1m"}, data);
