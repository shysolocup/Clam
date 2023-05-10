var { psc, bot } = require('../../index.js');
var { colors, colorify, pearl, pearlify, emojis, responses, caps } = require('../assets');
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

	let max = 40*rank;
	if (bal >= 0) max += (random.int( 100, (bal+200) ));
    let amount = random.int( 100, max ) * random.int( 2, 5 );
    
    let fail = random.choice([ true, true, true, false, false ]);

	let goldMult = econner.goldMult(ctx.author.id, ctx.guild.id);
	let multiplier = random.choice([ 50, 100, 150, 200, 250, 300, 350, 400, 450, 500 ]);
	if (goldMult && fail) amount -= multiplier;
    else if (goldMult && !fail) amount += multiplier;


	if ( 
        Catch( !fail && bal >= caps.max, { text: "You can't hold anymore." }) ||
        Catch( fail && bal <= caps.min, { text: "You can't hold any less." })
    ) return;
    
    
	if (!fail && bal+amount >= caps.max) amount = caps.max-bal;
    else if (fail && bal-amount <= caps.min) amount = caps.min+bal;

	
    var embed;
    
    if (fail) {
        embed = new psc.Embed({
		    description: `${emojis.fail}  **${random.choice(responses.crime.fail).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}** ${ (bal-amount == caps.max) ? "(minimum amount reached)" : ""}`,
			
			author: (goldMult) ? { name: `-${pearl}${multiplier} lost`, icon: "https://cdn.discordapp.com/emojis/1052759240885940264.png"} : undefined,

		    footer: { text: `( Balance: ${pearl}${pearlify(bal-amount)} )`, icon: psc.author.avatar() },
		    color: colors.fail
	    });
    }
	else {
        embed = new psc.Embed({
		    description: `${emojis.success}  **${random.choice(responses.crime.success).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}** ${ (bal+amount == caps.max) ? "(max amount reached)" : ""}`,
		    
			author: (goldMult) ? { name: `+${pearl}${multiplier}`, icon: "https://cdn.discordapp.com/emojis/1052759240885940264.png"} : undefined,

			footer: { text: `( Balance: ${pearl}${pearlify(bal+amount)} )`, icon: psc.author.avatar() },
		    color: colors.success
	    });
    }
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	
    (fail) ? econner.removeHand(amount, ctx.author.id) : econner.addHand(amount, ctx.author.id);
}

psc.command({ name: "crime", cooldown: "1m"}, data);
