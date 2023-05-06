var { psc, bot } = require('../../index.js');
var { colors, pearl, pearlify, emojis, formatify } = require('../assets');
const { Catch, Econner, Clanner } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
    var clans = new Clanner();

	let [id, amount] = cmd.args;
	
	amount = formatify(amount);
	
	if ( 
        Catch( cmd.onCooldown, {
		    head: `Woah there!  :face_with_spiral_eyes:`,
		    text: `You've been timed out from using this command for a bit.`,
	    }) ||

        Catch( !econner.has(ctx.author.id) || econner.fetchHand(ctx.author.id) <= 0, { text: "You don't have any pearls to withdraw." }) ||
		Catch( !amount, { text: "Please put an amount to withdraw."}) ||
		Catch( !parseInt(amount) && amount.toLowerCase() != "all", { text: "The amount has to be a number or all." }) ||
		Catch( !id, { text: "Please put a clan ID to withdraw the funds from."}) ||
		Catch( !clans.has(id), { text: "There is no clan with that ID" })
		
    ) return;

	let bal = econner.fetchHand(ctx.author.id);
	
	if (amount.toLowerCase() == "all") amount = bal;
	amount = parseInt(amount);

    let clan = clans.fetch(id, ctx.guild.id);

	if ( 
		Catch( amount > clan.funds, { text: "Clan doesn't have enough for that." }) ||
		Catch( amount < 0, { text: "Invalid amount" })
	) return;

	
	const embed = new psc.Embed({
		description: `${emojis.success} Withdrew ${"`"+pearl}${pearlify(amount)+"`"} from ${clan.name} (${"`"+id+"`"})`,
		footer: { text: `( User Balance: ${pearl}${pearlify(bal+amount)} )\n( Clan Funds: ${pearl}${pearlify(clan.funds-amount)} )`, icon: psc.author.avatar() },
		color: colors.success
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	econner.withdraw(amount, ctx.author.id, id, ctx.guild.id);
}

psc.command({ name: "withdraw", aliases: ["with"], cooldown: "5s"}, data);
