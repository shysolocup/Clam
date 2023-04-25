var { psc, bot } = require('../../index.js');
var { colors, colorify, pearl, pearlify, declineEmoji } = require('../assets');

async function data(ctx, cmd) {
	const { Hand, Econner } = require('../classes');
	let econner = new Econner();

	
	let user = (cmd.args[0]) ? psc.fetchUser(cmd.args[0]) : ctx.author;

	
	/* handling */
	if (!user) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Please put a valid user.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}


	/* setup stuff */
	if (!econner.has(user.id)) new Hand(user.id);
	let balance = econner.fetchHand(user.id);


	/* field stuff */
	let hand = `${pearl}${ (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 }`;
	let rank = colorify( (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 )[1];

	
	/* embed stuff */
	let embed = new psc.Embed({
		title: `${ (ctx.author.id == user.id) ? "Your" : `${user.username}'s` } Balance`,
		description: (ctx.author.id == user.id) ? (balance <= -999999999999999) ? "How did you manage this" : (balance < 0) ? "(PS. Enjoy rank 5 poor)" : "" : null,

		fields: [
			{ name: "Hand", value: "`" + `${hand}` + "`", inline: true },
			{ name: "Rank", value: "`" + `${rank}` + "`", inline: true }
		],

		color: colorify(balance)[0]
	});

	ctx.reply({ embeds: [embed] });
}

psc.command({name: "balance", aliases: ["bal"]}, data);
