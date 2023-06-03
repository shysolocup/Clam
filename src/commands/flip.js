var { psc, bot } = require('../../index.js');
var { colors, emojis, pearl, pearlify, formatify, caps } = require('../assets');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
	const { Catch, Econner } = require('../classes');
	let econner = new Econner();


	/* handling */
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;


	/* handling */
	let side = cmd.args[0];
	let bet = formatify(cmd.args[1]);

	if (!side.endsWith("s")) side += "s";

	let rand = random.choice(["Heads", "Tails"]);

	
	if (econner.has(ctx.author.id)) var bal = econner.fetchHand(ctx.author.id);
	if (
		Catch( !side, { text: "Please put a side to bet on. (`heads` or `tails`)"} ) ||
		Catch( side.toLowerCase() != "heads" && side.toLowerCase() != "tails", { text: "Please put either heads or tails for the side you want to bet on." }) ||
		
		Catch( !bet, { text: "Please put a bet."} ) ||
		Catch( !parseInt(bet) && bet.toLowerCase() != "all", { text: "Bet has to be a number or all (`5000`, `5,000`, `5k`)." }) ||
		Catch( !bal || bal <= 0, { text: "You don't have any money to bet." })
	) return;

	
	/* gold amp mult and bet formatting */
	let goldAmp = random.choice([50, 50, 50, 50, 100, 100, 100, 200, 200, 300]);
	let mult = random.choice([2, 3, 4, 5]);

	if (bet.toLowerCase() == "all") bet = bal;
	bet = parseInt(bet);


	/* more handling */
	if (
		Catch( bet > bal, { text: "You don't have that much." })
	) return;


	let amount = bet * mult;
	amount += goldAmp;
	
	
	/* embed stuff */
	let rawEmbed = {
		title: `${rand}! ${emojis.coins[rand.toLowerCase()]}`
	};


	if (rand.toLowerCase() == side.toLowerCase()) {
		rawEmbed.footer = `YOU WIN! Your bet was added +${goldAmp}   +${pearl}${pearlify(amount)}`;
		rawEmbed.color = colors.success;

		if (bal+amount >= caps.max) {
			amount = caps.max-bal;
			rawEmbed.footer = `YOU WIN! You can't hold any more   +${pearl}${pearlify(amount)}`;

			econner.setHand(caps.max, ctx.author.id);
		}
		else {
			econner.addHand(amount, ctx.author.id);
		}
	}
		
	else {
		rawEmbed.footer = `YOU LOSE! Better luck next time  -${pearl}${pearlify(bet)}`;
		rawEmbed.color = colors.fail;

		if (bal-bet <= caps.min) {
			amount = caps.min+bet;
			rawEmbed.footer = `YOU LOSE! How did you even manage this   -${pearl}${pearlify(amount)}`;

			econner.setHand(caps.min, ctx.author.id);
		}
		else {
			econner.removeHand(bet, ctx.author.id);
		}
	}

	let embed = new psc.Embed(rawEmbed);

	ctx.reply({ embeds: [embed] }).catch(e=>{});
}


psc.command({ name: "flip", aliases: ["coinflip"], cooldown: "3s"}, data);
