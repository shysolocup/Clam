var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	const { Clanner, Catch } = require('../classes');
	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`
	}) ) return;

	
	let [ mention, id ] = cmd.args;
	var clans = new Clanner();

	let user = await psc.fetchUser(mention);


	/* handling */
	if (
		Catch( !user, { text: 'Please put a valid user.' }) ||
		Catch( !id, { text: 'Please put a clan ID.' }) ||
		Catch( !clans.has(id, ctx.guild.id), { text: 'There is no clan with that ID.'})
	) return;
	

	let clan = clans.fetch(id);


	/* more handling */
	if (
		Catch( clan.owner != ctx.author.id, { text: "Only the clan owner can deop users." }) ||
		Catch( !clan.ops.includes(user.id), { text: "User is already not an operator." }) ||
		Catch( ctx.author.id == user.id, { text: "You can't yourself." })
	) return;

	
	const embed = new psc.Embed({
		description: `**${emojis.success}  Removed *<@${user.id}>*'s operator permissions | *${clan.name}***`,
		footer: `( id: ${clan.id} )`,
		color: colors.success
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	clans.deop(clan.id, user.id, ctx.guild.id);
}

psc.command({ name: "deop", cooldown: "2s"}, data);
