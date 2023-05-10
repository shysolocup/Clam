const { Soup } = require('stews');
var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');
var { Clanner, Catch } = require('../classes');

async function data(ctx, cmd) {
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;


	let clans = new Clanner();
	let id = cmd.args[0];
	

	/* handling */
	if ( 
		Catch( !id, { text: "Please put a clan ID."}) ||
		Catch( !clans.has(id, ctx.guild.id), { text: "There is no clan with that ID." })
	) return;


    let clan = clans.fetch(id);
    

	/* more handling */
	if (
		Catch( clan.status == 2 || clan.status == 3, { text: "This clan is invite only." }) ||
		Catch( clan.members.includes(ctx.author.id), { text: "You're already in that clan."}) ||
		Catch( clan.bans.includes(ctx.author.id), { text: "You're banned in that clan."})
	) return;
    

	/* embed and death */
	let embed = new psc.Embed({
		title: "Joining  👥",
		description: `${emojis.success} Welcome to the ${ "`"+clan.name+"`" } club <@${ctx.author.id}>`,
		
		footer: `( id: ${id} )`,
		color: colors.success
	});


    ctx.reply( {embeds: [embed] }).catch(e=>{});
	clans.join(id, ctx.author.id, ctx.guild.id);
}

psc.command("join", data);
