var { psc, bot } = require('../../index.js');
var { colors, infostuffs } = require('../assets');
var { Soup } = require('stews');

async function data(ctx, cmd) {
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;


	const { Econner, Catch } = require('../classes');
	let econner = new Econner();

	let page = 0;
	let section = "user";


	/* getting the leaderboards */
	var clanLB = await econner.clanLB(ctx.guild.id, ctx.author.id);
	var userLB = await econner.userLB(ctx.guild.id, ctx.author.id);


	let guild = ctx.guild.name.split("");
	guild[0] = guild[0].toUpperCase();
	guild = guild.join("");


	/* button stuff */
	var disabled = ((section == "user") ? userLB.total : clanLB.total) <= 0;

	let bigLeftButton = new psc.Button({ id: "clamLB/bigLeft", emoji: "⏮️", style: "secondary", disabled: disabled });
	let leftButton = new psc.Button({ id: "clamLB/left", emoji: "◀", style: "secondary", disabled: disabled });
	let rightButton = new psc.Button({ id: "clamLB/right", emoji: "▶", style: "secondary", disabled: disabled });
    let bigRightButton = new psc.Button({ id: "clamLB/bigRight", emoji: "⏭️", style: "secondary", disabled: disabled });

	let switchButton = new psc.Button({ id: `clamLB/switch`, emoji: (section == "user") ? "🛡️" : "👥", style: "secondary" });
	
	let row = new psc.ActionRow([ bigLeftButton, leftButton, switchButton, rightButton, bigRightButton ]);


	/* embed stuff */
	let embed = new psc.Embed({
		author: { name: `${guild} Leaderboards` },

		title: (section == "user") ? "Users Leaderboard" : "Clans Leaderboard",
		description: `${ (section == "user") ? 
            ((userLB.total <= 0) ? "None" : `${userLB.content[page].join("\n")}\n** **`) : 
            ((clanLB.total <= 0) ? "None" : `${clanLB.content[page].join("\n")}\n** **`)
		}\n** **`,

		footer: `Page ${page+1}/${ (section == "user") ? userLB.pages : clanLB.pages }`,

		thumbnail: ctx.guild.iconURL(),
		color: colors.clam
	});


	let a = await ctx.reply({ embeds: [embed], components: [row] }).catch(e=>{});


	infostuffs.push(a.id, [ctx.author, section, page]);
	setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command({name: "leaderboard", aliases: ["lb"]}, data);
