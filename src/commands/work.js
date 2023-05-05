var { psc, bot } = require('../../index.js');
var { colors, colorify, responses, pearl, pearlify } = require('../assets');
const { Catch, Econner, Hand } = require('../classes');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
	
	if ( Catch( cmd.onCooldown, {
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
	}) ) return;

    
    if (!econner.has(ctx.author.id)) new Hand(ctx.author.id);

    let bal = econner.fetchHand(ctx.author.id);
    let rank = colorify(bal)[1];
    let amount = random.int( 25, (10*rank)+(random.int( 25, (bal+50) )) );

	
	const embed = new psc.Embed({
		description: `**${random.choice(responses.work).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}**`,
		footer: { text: `( Balance: ${pearl}${pearlify(bal+amount)} )`, icon: psc.author.avatar() },
		color: colors.blurple
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	econner.addHand(amount, ctx.author.id);
}

psc.command({ name: "work", cooldown: "15s"}, data);
