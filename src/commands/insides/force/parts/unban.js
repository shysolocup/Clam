var { psc, bot } = require('../../../../../index.js');
var { colors, emojis } = require('../../../../assets');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	const { Clanner, Catch } = require('../../../../classes');
	
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
		Catch( !clan.bans.includes(user.id), { text: "User isn't banned from that clan." })
	) return;

	
	const embed = new psc.Embed({
		description: `**${emojis.success}  Unbanned *<@${user.id}>* | *${clan.name}***`,

		footer: `( id: ${clan.id} )`,
		color: colors.success
	});


	ctx.reply({ embeds: [embed] }).catch(e=>{});
	clans.unban(clan.id, user.id, ctx.guild.id);
}


module.exports = {
    name: "unban",
    data: data
};
