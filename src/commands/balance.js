var { psc, bot } = require('../../index.js');
var { colors, colorify, pearl, pearlify, emojis } = require('../assets');
var { Soup } = require('stews');

async function data(ctx, cmd) {
	const { Econner, Catch } = require('../classes');
	let econner = new Econner();

	
	let user = (cmd.args[0]) ? await psc.fetchUser(cmd.args[0]) : ctx.author;

	
	/* handling */
	if ( Catch( !user, { text: `Please put a valid user.` }) ) return;


	let balance = (econner.has(user.id)) ? econner.fetchHand(user.id) : 0;


	/* field stuff */
	let hand = `${pearl}${ (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 }`;
	let rank = colorify( (econner.has(user.id)) ? pearlify(Math.round(balance)) : 0 )[1];
	let leaderboard = Soup.from(econner.globalLeaderboard());

	let globalRank = (leaderboard.has(user.id)) ? leaderboard.indexOf(user.id)+1 : "None";

	let username = user.username.split("");username[0]=username[0].toUpperCase();username=username.join("");

	if (typeof globalRank == "number") {
		globalRank = `${globalRank}${((int) => {
			if (int > 3 && int < 21) return "th";
			switch( int % 10) {
				case 1: return "st"; break;
				case 2: return "nd"; break;
				case 3: return "rd"; break;
				default: return "th"; break;
			}
		})(globalRank)}`;
	}
	
	/* embed stuff */
	let embed = new psc.Embed({
		title: `${ (ctx.author.id == user.id) ? "Your" : `${username}'s` } Balance  :bucket:`,
		description: `Global Leaderboard Rank: ${globalRank}`,

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
