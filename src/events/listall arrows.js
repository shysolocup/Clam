var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets/index.js');
var { Clanner, Catch } = require('../classes/index.js');

const { Soup } = require('stews');

async function data(ctx, cmd) {
	var buttonID = ctx.customId;

	if (buttonID.includes("clanAll/")) {
		var clans = new Clanner();
		var list = clans.listify(ctx.guild.id, true);
		var disabled = list.total <= 0;


		/* handling */
		if ( Catch( !infostuffs.has(ctx.message.id), { text: "Command timed out.", poster: ctx.reply.bind(ctx) }) ) return;


		/* stuff */
		var name = buttonID.split("clanAll/")[1];
		var [ user, page ] = infostuffs.get(ctx.message.id);


		/* more handling */
        if ( Catch( user.id != ctx.member.id, { text: "That's not for you. :angry:", poster: ctx.reply.bind(ctx) }) ) return;


		/* page handling */
		if (name == "bigLeft") page = 0;
		else if (name == "left") page = (page-1 < 0) ? list.pages-1 : page-1;
		else if (name == "right") page = (page+1 > list.pages-1) ? 0 : page+1;
		else if (name == "bigRight") page = list.pages-1;
		
		
		/* buttons */
		let bigLeftButton = new psc.Button({ id: "clanAll/bigLeft", emoji: "⏮️", style: "secondary", disabled: disabled });
		let leftButton = new psc.Button({ id: "clanAll/left", emoji: "◀", style: "secondary", disabled: disabled });
		let rightButton = new psc.Button({ id: "clanAll/right", emoji: "▶", style: "secondary", disabled: disabled });
		let bigRightButton = new psc.Button({ id: "clanAll/bigRight", emoji: "⏭️", style: "secondary", disabled: disabled });
		
		let row = new psc.ActionRow([ bigLeftButton, leftButton, rightButton, bigRightButton ]);


		/* catch and embed stuff */
		if ( 
			Catch( !clans.all[ctx.guild.id], {
				head: `All Clans in ${ctx.guild.name}`,

				fields: [{
					name: "• None", 
					value: "** ** Use !create to start up your own clan!"
				}],

				color: colors.clam,

				thumbnail: ctx.guild.iconURL(),
				footer: `Page 1/1`,

				delete: false,
				components: [row],

				poster: ctx.update.bind(ctx)
			}) 
		) return;
		


		/* normal embed stuff */
		let embed = new psc.Embed({
			title: `All Clans in ${ctx.guild.name}`,
			description: `There ${ (list.total == 1) ? "is" : "are" } ${list.total} ${ (list.total == 1) ? "clan" : "clans" } in this server`,

			fields: list.fields[page],

			color: colors.clam,

			thumbnail: ctx.guild.iconURL(),
			footer: `Page ${page+1}/${list.pages}`
		});
		
		ctx.update({ embeds: [embed], components: [row] } ).catch(e=>{});

		infostuffs.set(ctx.message.id, [user, page]);
	}
}

psc.buttonAction(data);
