var { psc, bot } = require('../../index.js');
var { colors, colorify, pearl, pearlify, emojis } = require('../assets');
var { Soup } = require('stews');

async function data(ctx, cmd) {
	const { Econner, Catch } = require('../classes');
	let econner = new Econner();

	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;

	
	let user = (cmd.args[0]) ? await psc.fetchUser(cmd.args[0]) : ctx.author;

	
	/* handling */
	if ( Catch( !user, { text: `Please put a valid user.` }) ) return;


	let balance = (econner.has(user.id)) ? econner.fetchHand(user.id) : 0;


	/* field stuff */
	let hand = `${pearl}${ (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 }`;
	let rank = colorify( (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 )[1];

	let leaderboard = Soup.from( (await econner.userLB(ctx.guild)).raw );
	let userRank = (leaderboard.has(user.id)) ? econner.rank(leaderboard.indexOf(user.id)+1) : "None";
	let username = user.username.split("");username[0]=username[0].toUpperCase();username=username.join("");
	
	/* embed stuff */
	let embed = new psc.Embed({
		title: `${ (ctx.author.id == user.id) ? "Your" : `${username}'s` } Balance  :bucket:`,
		description: `Leaderboard Rank: ${userRank}`,

		fields: [
			{ name: "Hand", value: "`" + `${hand}` + "`", inline: true },
			{ name: "Rank", value: "`" + `${rank}` + "`", inline: true }
		],

		footer: { text: user.tag, icon_url: psc.user.avatar(user) },
		color: colorify(balance)[0]
	});

	ctx.reply({ embeds: [embed] }).catch(e=>{});
}

psc.command({name: "balance", aliases: ["bal"]}, data);
