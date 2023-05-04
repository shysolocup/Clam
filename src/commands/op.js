var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	const { Clanner, Catch } = require('../classes');
	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
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
		Catch( clan.owner != ctx.author.id, { text: "Only the clan owner can op users." }) ||
		Catch( clan.ops.includes(user.id), { text: "User is already operator in that clan." }) ||
		Catch( !clan.members.includes(user.id), { text: "You can't op someone who isn't in the clan." }) ||
		Catch( ctx.author.id == user.id, { text: "You can't yourself." })
	) return;

	
	const embed = new psc.Embed({
		description: `**${emojis.success}  Gave *<@${user.id}>* operator permissions | *${clan.name}***`,
		footer: `( id: ${clan.id} )`,
		color: colors.success
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	clans.op(clan.id, user.id);
}

psc.command({ name: "op", cooldown: "2s"}, data);
