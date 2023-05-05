var { psc, bot } = require('../../index.js');
var { colors, pearl, pearlify } = require('../assets');
const { Catch, Econner, Clanner } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
    var clans = new Clanner();
	
	if ( 
        Catch( cmd.onCooldown, {
		    head: `Woah there!  :face_with_spiral_eyes:`,
		    text: `You've been timed out from using this command for a bit.`,
	    }) ||

        Catch( !econner.has(ctx.author.id), { text: "You don't have any pearls to deposit." })
    ) return;

    let [amount, id] = cmd.args;
    

    let clan = clans.fetch(id, ctx.guild.id);

	
	const embed = new psc.Embed({
		description: `**${random.choice(responses.work).replace("$", "`"+`${pearl}${pearlify(amount)}`+"`")}**`,
		footer: { text: `( User Balance: ${pearl}${pearlify(bal+amount)} )\n( Clan Funds: ${} )`, icon: psc.author.avatar() },
		color: colors.success
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	econner.deposit(amount, ctx.author.id, );
}

psc.command({ name: "work", cooldown: "5s"}, data);
