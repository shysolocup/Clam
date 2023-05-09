var { psc, bot } = require('../../index.js');
var { colors, pearl, pearlify, emojis, responses, caps } = require('../assets');
const { Catch, Econner, Hand } = require('../classes');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
	
	if ( Catch( cmd.onCooldown, {
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
	}) ) return;


    let user = await psc.fetchGuildUser(cmd.args[0]);


    if (
        Catch( !user, { text: "Please put a valid user." }) ||
        Catch( !econner.has(user.id), { text: "User doesn't have anything to steal." })
    ) return;


    if (!econner.has(ctx.author.id)) new Hand(ctx.author.id);

    let victimBal = econner.fetchHand(user.id);
    let receiverBal = econner.fetchHand(ctx.author.id);

    let amount = random.int( 1, victimBal );

    let fail = random.choice([ true, true, true, false, false ]);


	if (
        Catch( !fail && receiverBal >= caps.max, { text: "You can't hold anymore." }) ||
        Catch( fail && receiverBal <= caps.min, { text: "You can't hold any less." })
    ) return;
    
    
	if (!fail && receiverBal+amount >= caps.max) amount = caps.max-receiverBal;
    else if (fail && receiverBal-amount <= caps.min) amount = caps.min+receiverBal;

	
    var embed;
    
    if (fail) {
        embed = new psc.Embed({
		    description: `${emojis.fail}  **${random.choice(responses.steal.fail).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}** ${ (receiverBal-amount == caps.max) ? "(minimum amount reached)" : ""}`,
		    footer: { text: `( Balance: ${pearl}${pearlify(receiverBal-amount)} )`, icon: psc.author.avatar() },
		    color: colors.fail
	    });
    }
    
	else {
        embed = new psc.Embed({
		    description: `${emojis.success}  **${random.choice(responses.steal.success).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}** ${ (receiverBal+amount == caps.max) ? "(max amount reached)" : ""}`,
		    footer: { text: `( Balance: ${pearl}${pearlify(receiverBal+amount)} )`, icon: psc.author.avatar() },
		    color: colors.success
	    });
    }
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	
    (fail) ? econner.removeHand(amount, ctx.author.id) : econner.give(amount, user.id, ctx.author.id);
}

psc.command({ name: "steal", aliases: ["rob"], cooldown: "1m"}, data);
