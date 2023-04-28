var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	const { Clan, Catch } = require('../classes');

	/* handling */
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
	}) ) return;


	let attachments = Soup.from(ctx.attachments);

	
	/* clan info stuff */
	let name = cmd.args.join(" ");
	let icon = attachments[0];
	let banner = attachments[1];
	
	let clan = new Clan(ctx, name, icon, banner);
	
	const embed = new psc.Embed({
		title: "Clan Creation :sparkles:",
		description: `${emojis.success} Created ${ (name) ? " `" + name + "`" : "your new clan"}!`,
		footer: `( id: ${clan.id} )`,
		color: colors.success
	});

	ctx.reply({ embeds: [embed] }).catch(e=>{});
}

psc.command({ name: "create", cooldown: "1m"}, data);
