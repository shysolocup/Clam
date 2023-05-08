var { psc, bot } = require('../../index.js');
var { colors, pearl, pearlify, emojis, formatify, caps } = require('../assets');
const { Catch, Econner, Clanner } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
    var econner = new Econner();
    var clans = new Clanner();

	var [id, amount] = cmd.args;

	amount = formatify(amount);
	
	if ( 
        Catch( cmd.onCooldown, {
		    head: `Woah there!  :face_with_spiral_eyes:`,
		    text: `You've been timed out from using this command for a bit.`,
	    }) ||

        Catch( !econner.has(ctx.author.id) || econner.fetchHand(ctx.author.id) <= 0, { text: "You don't have any pearls to deposit." }) ||
		Catch( !amount, { text: "Please put an amount to deposit."}) ||
		Catch( !parseInt(amount) && amount.toLowerCase() != "all", { text: "The amount has to be a number or all." }) ||
		Catch( !id, { text: "Please put a clan ID to deposit the funds into."}) ||
		Catch( !clans.has(id), { text: "There is no clan with that ID" })
		
    ) return;

	let bal = econner.fetchHand(ctx.author.id);
	
	if (amount.toLowerCase() == "all") amount = bal;
	amount = parseInt(amount);


	if ( 
		Catch( amount > bal, { text: "You don't have enough for that." }) ||
		Catch( amount <= 0, { text: "Invalid amount" })
	) return;
    

    let clan = clans.fetch(id, ctx.guild.id);


	if ( Catch( clan.funds >= caps.max, { text: "Clan can't hold anymore." })) return;


	if (clan.funds+amount >= caps.max) amount = caps.max - clan.funds;

	
	const embed = new psc.Embed({
		description: `${emojis.success} Deposited ${"`"+pearl}${pearlify(amount)+"`"} into ${clan.name} (${"`"+id+"`"}) (max amount reached)`,
		footer: { text: `( User Balance: ${pearl}${pearlify(bal-amount)} )\n( Clan Funds: ${pearl}${pearlify(clan.funds+amount)} )`, icon: psc.author.avatar() },
		color: colors.success
	});
	

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	econner.deposit(amount, ctx.author.id, id, ctx.guild.id);
}

psc.command({ name: "deposit", aliases: ["dep"], cooldown: "5s"}, data);
