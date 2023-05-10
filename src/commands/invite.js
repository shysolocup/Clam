const { Soup } = require('stews');
var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets');
var { Clanner, Catch } = require('../classes');

async function data(ctx, cmd) {
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;
	

	let clans = new Clanner();
	let [user, id] = cmd.args;

    user = await psc.fetchUser(user);


    /* handling */
	if ( 
		Catch( !user, { text: 'Please put a valid user.' }) ||
		Catch( !id, { text: 'Please put a clan ID.' }) ||
		Catch( !clans.has(id, ctx.guild.id), { text: 'There is no clan with that ID.'})
	) return;


    let clan = clans.fetch(id);

    
	/* more handling */
	if (
		Catch( (clan.status == 2 || clan.status == 3) && !clan.members.includes(ctx.author), {
			text: 'You have to be in an invite only clan to invite people.'
		}) ||
		Catch( clan.members.includes(user.id), { text: 'User is already in that clan.'}) ||
		Catch( clan.bans.includes(user.id), { text: 'User is banned from that clan.'})
	) return;


    /* buttons n stuff */
    let inviteAccept = new psc.Button({ id: "inviteAccept", label: "Accept", style: "success"});
    let inviteDecline = new psc.Button({ id: "inviteDecline", label: "Decline", style: "danger"});

    let row = new psc.ActionRow([ inviteAccept, inviteDecline ]);


	/* embed and death */
	let embed = new psc.Embed({
		color: colors.blurple,
		title: "Invite  :tada:",
		description: `Hey <@${user.id}>! You were invited to join ${clan.name} by <@${ctx.author.id}>!`,
		footer: `( id: ${id} )`
	});


    let a = await ctx.reply( {embeds: [embed], components: [row]} ).catch(e=>{});

    
    infostuffs.push(a.id, [user, clan]);
    setTimeout(() => infostuffs.delete(a.id), 21600000);

}

psc.command({ name: "invite", aliases: ["inv"], cooldown: "10s"}, data);
