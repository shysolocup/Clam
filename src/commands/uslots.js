var { psc, bot } = require('../../index.js');
var { colors, emojis, pearl, pearlify, formatify, caps } = require('../assets');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
	const { Catch, Econner } = require('../classes');
	let econner = new Econner();

	/* handling */
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
	}) ) return;

	
	/* emoji stuff */
	let rand = [];
	
	for (let i = 0; i < 3; i++) {
		rand.push(random.choice(emojis.uslots));
	}
	
	
	/* handling */
	let bet = formatify(cmd.args[0]);
	if (econner.has(ctx.author.id)) var bal = econner.fetchHand(ctx.author.id);
	if (
		Catch( !bet, { text: "Please put a bet."} ) ||
		Catch( !parseInt(bet) && bet.toLowerCase() != "all", { text: "Bet has to be a number or all (`5000`, `5,000`, `5k`)." }) ||
		Catch( !bal || bal <= 0, { text: "You don't have any money to bet." })
	) return;

	
	/* mult and bet formatting */
	let mult = random.int(200, 500);

	if (bet.toLowerCase() == "all") bet = bal;
	bet = parseInt(bet);


	/* more handling */
	if (
		Catch( bet > bal, { text: "You don't have that much." })
	) return;


	let amount = bet*mult;
	
	
	/* embed stuff */
	let rawEmbed = {
		title: "Ultimate Slot Machine  :fire::slot_machine::fire:",
		description: rand.join(" | ")
	};


	if (rand[0] == rand[1] && rand[1] == rand[2]) {
		rawEmbed.footer = `YOU WIN! Your bet was multiplied x${mult}   +${pearl}${pearlify(amount)}`;
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

psc.command({ name: "uslots", aliases: ["uslot"], cooldown: "5s"}, data);
