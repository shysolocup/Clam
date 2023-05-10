var { psc, bot } = require('../../index.js');
var { colors, pearl, pearlify, emojis, responses, caps } = require('../assets');
const { Catch, Econner, Hand } = require('../classes');

const { Soup, random } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;


    let user = await psc.fetchUser(cmd.args[0]);


    if (
        Catch( !user, { text: "Please put a valid user." }) ||
        Catch( !econner.has(user.id), { text: "User doesn't have anything to steal." })
    ) return;


    if (!econner.has(ctx.author.id)) new Hand(ctx.author.id);

    let victimBal = econner.fetchHand(user.id);
    let receiverBal = econner.fetchHand(ctx.author.id);

    let amount = random.int( 1, victimBal );

    let fail = random.choice([ true, true, true, true, false ]);

    let goldMult = econner.goldMult(ctx.author.id, ctx.guild.id);
	let multiplier = random.choice([ 50, 100, 150, 200, 250, 300, 350, 400, 450, 500 ]);
	if (goldMult && fail) amount -= multiplier;
    else if (goldMult && !fail) amount += multiplier;


	if (
        Catch( !fail && receiverBal >= caps.max, { text: "You can't hold anymore." }) ||
        Catch( fail && receiverBal <= caps.min, { text: "You can't hold any less." }) ||
        Catch( !fail && victimBal <= caps.max, { text: "User can't hold any less." })
    ) return;
    
    
	if (!fail && receiverBal+amount >= caps.max) amount = caps.max-receiverBal;
    else if (fail && receiverBal-amount <= caps.min) amount = caps.min+receiverBal;
    else if (!fail && victimBal-amount <= caps.min) amount = caps.min+victimBal;

	
    var embed;

    
    if (fail) {
        embed = new psc.Embed({
		    description: `${emojis.fail}  **${random.choice(responses.steal.fail).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`").replace("@", `<@${user.id}>`)}** ${ (receiverBal-amount == caps.max) ? "(minimum amount reached)" : ""}`,

            author: (goldMult) ? { name: `-${pearl}${multiplier} lost`, icon: "https://cdn.discordapp.com/emojis/1052759240885940264.png"} : undefined,

		    footer: { text: `( Balance: ${pearl}${pearlify(receiverBal-amount)} )`, icon: psc.author.avatar() },
		    color: colors.fail
	    });
    }
    
	else {
        embed = new psc.Embed({
		    description: `${emojis.success}  **${random.choice(responses.steal.success).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}** ${ (receiverBal+amount == caps.max) ? "(max amount reached)" : ""}`,

            author: (goldMult) ? { name: `+${pearl}${multiplier}`, icon: "https://cdn.discordapp.com/emojis/1052759240885940264.png"} : undefined,

		    footer: { text: `( Balance: ${pearl}${pearlify(receiverBal+amount)} )`, icon: psc.author.avatar() },
		    color: colors.success
	    });
    }
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	
    (fail) ? econner.removeHand(amount, ctx.author.id) : econner.give(amount, user.id, ctx.author.id);
}

psc.command({ name: "steal", aliases: ["rob"], cooldown: "5m"}, data);
