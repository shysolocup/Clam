var { psc, bot } = require('../../index.js');
var { colors, pearl, pearlify, emojis, formatify, caps } = require('../assets');
var { Soup } = require('stews');

async function data(ctx, cmd) {
	const { Econner, Hand, Catch } = require('../classes');
	let econner = new Econner();

    let [ userID, amount ] = cmd.args;

	let user = await psc.fetchUser(userID);
    amount = formatify(amount);

    
    if ( 
        Catch( cmd.onCooldown, {
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		}) ||

        Catch( !user, { text: `Please put a valid user.` }) ||
        Catch( !econner.has(ctx.author.id) || econner.fetchHand(ctx.author.id) <= 0, { text: "You don't have any pearls to give." }) ||
		Catch( !amount, { text: "Please put an amount to give."}) ||
		Catch( !parseInt(amount) && amount.toLowerCase() != "all", { text: "The amount has to be a number or all." })	
        
    ) return;


    if (!econner.has(user.id)) new Hand(user.id);


    let senderBal = econner.fetchHand(ctx.author.id);
    let receiverBal = econner.fetchHand(user.id);


    if (amount.toLowerCase() == "all") amount = senderBal;
	amount = parseInt(amount);


    if ( Catch( receiverBal >= caps.max, { text: "User can't hold anymore." })) return;
	if (receiverBal+amount >= caps.max) amount = caps.max - receiverBal;
	

	/* embed stuff */
    let embed = new psc.Embed({
        description: `**${emojis.success} Thanks <@${ctx.author.id}> I'm sure <@${user.id}> appreciates the ${"`"+pearl}${pearlify(amount)+"`"} donation! ${ (receiverBal+amount >= caps.max) ? "(max amount reached)" : "" }**`,
        footer: `( Your Balance: ${pearl}${pearlify(senderBal-amount)} )\n( Receiver's Balance: ${pearl}${pearlify(receiverBal+amount)} )`,
        
        color: colors.success
    });


	ctx.reply({ embeds: [embed] }).catch(e=>{});

    econner.give(amount, ctx.author.id, user.id);
}

psc.command({ name: "give", aliases: ["donate", "don"], cooldown: "5s" }, data);
