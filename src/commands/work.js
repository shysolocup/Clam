var { psc, bot } = require('../../index.js');
var { colors, colorify, responses, pearl, pearlify, caps } = require('../assets');
const { Catch, Econner, Hand } = require('../classes');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;

    
    if (!econner.has(ctx.author.id)) new Hand(ctx.author.id);


    let bal = econner.fetchHand(ctx.author.id);
    let rank = colorify(bal)[1];

	let max = 10*rank;
	if (bal >= 0) max += (random.int( 25, (bal+50) ));
    let amount = random.int( 25, max );

	let goldMult = econner.goldMult(ctx.author.id, ctx.guild.id);
	let multiplier = random.choice([ 50, 100, 150, 200, 250, 300, 350, 400, 450, 500 ]);
	if (goldMult) amount += multiplier;

	if ( Catch( bal >= caps.max, { text: "You can't hold anymore." })) return;
	if (bal+amount >= caps.max) amount = caps.max-bal;

	
	const embed = new psc.Embed({
		description: `**${random.choice(responses.work).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}** ${ (bal+amount == caps.max) ? "(max amount reached)" : ""}`,
		
		author: (goldMult) ? { name: `+${pearl}${multiplier}`, icon: "https://cdn.discordapp.com/emojis/1052759240885940264.png"} : undefined,

		footer: { text: `( Balance: ${pearl}${pearlify(bal+amount)} )`, icon: psc.author.avatar() },
		color: colors.blurple
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	econner.addHand(amount, ctx.author.id);
}

psc.command({ name: "work", cooldown: "10s"}, data);
