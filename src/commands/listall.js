/* THIS IS A DEV/ADMIN ONLY COMMAND AND THUS ONLY SHOWS UP IN THE LOCKED ADMINISTRATOR SECTION */

var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs, isDev } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');

async function data(ctx, cmd) {
	/* handling */
	let gay = !(psc.author.hasPermissions(["admin"]) || isDev(ctx.author.id));
    if (
		Catch( gay, { post: false }) ||

		Catch( cmd.onCooldown, { 
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		})
	) return;
	
	
	/* clanner and list stuff */
	var clans = new Clanner();
	var list = clans.listify(ctx.guild.id, true);
    var disabled = list.total <= 0;

	var page = 0;
	
	
	/* buttons */
	let bigLeftButton = new psc.Button({ id: "clanAll/bigLeft", emoji: "⏮️", style: "secondary", disabled: disabled });
	let leftButton = new psc.Button({ id: "clanAll/left", emoji: "◀", style: "secondary", disabled: disabled });
	let rightButton = new psc.Button({ id: "clanALl/right", emoji: "▶", style: "secondary", disabled: disabled });
    let bigRightButton = new psc.Button({ id: "clanAll/bigRight", emoji: "⏭️", style: "secondary", disabled: disabled });
	
	let row = new psc.ActionRow([ bigLeftButton, leftButton, rightButton, bigRightButton ]);


	/* catch and embed stuff */
	if ( 
		Catch( !clans.all[ctx.guild.id], {
			head: `All Clans in ${ctx.guild.name}`,
			text: `There are no clans in this server`,

			fields: [{
				name: "• None", 
				value: "** ** Use !create to start up your own clan!"
			}],

			color: colors.clam,

			thumbnail: ctx.guild.iconURL(),
			footer: `Page 1/1`,
			
			delete: false,
			textEmoji: false,
			components: [row]
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

	
	let a = await ctx.reply({ embeds: [embed], components: [row] } ).catch(e=>{});
	

    infostuffs.push(a.id, [ctx.author, page]);
	setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command({ name: "listall", aliases: ["viewall"] }, data);
