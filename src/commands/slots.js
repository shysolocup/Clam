var { psc, bot } = require('../../index.js');
var { colors, emojis, pearl, pearlify } = require('../assets');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
	const { Clan, Catch } = require('../classes');

	/* handling */
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
	}) ) return;

	
	/* emoji stuff */
	let emojis = [];
	
	for (let i = 0; i < 3; i++) {
		emojis.push(random.choice(emojis.slots));
	}
	
	
	let bet = cmd.args[0];
	if ( Catch( !bet, { text: "Please put a bet."} )) return;
	
	let mult = random.int(2, 10);
	
	
	let rawEmbed = {
		title: "Slot Machine :slot_machine:"
	};

	if (emojis[0] == emojis[1] == emojis[2]) {
		rawEmbed.description = emojis.join(" | ");
		rawEmbed.footer = `YOU WIN! You`;
	}
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
}

psc.command({ name: "slots", aliases: ["slot"], cooldown: "5s"}, data);
