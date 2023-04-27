var { psc, bot } = require('../../index.js');
var { colors, colorify, pearl, pearlify, emojis } = require('../assets');

async function data(ctx, cmd) {
	const { Econner } = require('../classes');
	let econner = new Econner();

	
	let user = (cmd.args[0]) ? await psc.fetchUser(cmd.args[0]) : ctx.author;

	
	/* handling */
	if (!user) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${emojis.decline} Please put a valid user.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}


	let balance = (econner.has(user.id)) ? econner.fetchHand(user.id) : 0;


	/* field stuff */
	let hand = `${pearl}${ (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 }`;
	let rank = colorify( (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 )[1];

	let username = user.username.split("");username[0]=username[0].toUpperCase();username=username.join("");

	
	/* embed stuff */
	let embed = new psc.Embed({
		title: `${ (ctx.author.id == user.id) ? "Your" : `${username}'s` } Balance  :bucket:`,
		description: (ctx.author.id == user.id) ? (balance <= -999999999999999) ? "How did you manage this" : (balance < 0) ? "(PS. Enjoy rank 5 poor)" : "" : null,

		fields: [
			{ name: "Hand", value: "`" + `${hand}` + "`", inline: true },
			{ name: "Rank", value: "`" + `${rank}` + "`", inline: true }
		],

		footer: { text: user.tag, icon_url: psc.user.avatar(user) },
		color: colorify(balance)[0]
	});

	ctx.reply({ embeds: [embed] });
}

psc.command({name: "balance", aliases: ["bal"]}, data);
