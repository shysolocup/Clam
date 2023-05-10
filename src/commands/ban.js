var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	const { Clanner, Catch } = require('../classes');
	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
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
		Catch( !clan.ops.includes(ctx.author.id) && clan.owner != ctx.author.id, { text: "You have to have operator to ban users." }) ||
		Catch( clan.ops.includes(user.id) && clan.owner != ctx.author.id, { text: "Only the owner can ban operators." }) ||
		Catch( clan.bans.includes(user.id), { text: 'User is already banned from that clan.' }) ||
		Catch( clan.owner == user.id, { text: "You can't ban the owner of the clan." }) ||
		Catch( ctx.author.id == user.id, { text: "You can't yourself." })
	) return;

	
	const embed = new psc.Embed({
		description: `**${emojis.success}  Banned *<@${user.id}>* | *${clan.name}***`,
		footer: `( id: ${clan.id} )`,
		color: colors.success
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	clans.ban(clan.id, user.id, ctx.guild.id);
}

psc.command({ name: "ban", cooldown: "3s"}, data);
