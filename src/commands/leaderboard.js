var { psc, bot } = require('../../index.js');
var { colors, infostuffs } = require('../assets');
var { Soup } = require('stews');

async function data(ctx, cmd) {
	const { Econner, Catch } = require('../classes');
	let econner = new Econner();

	let page = 0;
	let section = "clan";


	/* getting the leaderboards */
	var clanLB = await econner.clanLB(ctx.guild.id);
	var userLB = await econner.userLB(ctx.guild.id);


	let guild = ctx.guild.name.split("");
	guild[0] = guild[0].toUpperCase();
	guild = guild.join("");


	/* embed stuff */
	let embed = new psc.Embed({
		author: { name: `${guild} Leaderboards` },

		title: (section == "user") ? "Users Leaderboard" : "Clans Leaderboard",
		description: (section == "user") ? 
			((userLB.count <= 0) ? "None" : `${userLB.content[page].join("\n")}\n** **`) : 
			((clanLB.count <= 0) ? "None" : `${clanLB.content[page].join("\n")}\n** **`) ,

		footer: `Page ${page+1}/${ (section == "user") ? userLB.pages : clanLB.pages }`,

		thumbnail: ctx.guild.iconURL(),
		color: colors.clam
	});


	let a = ctx.reply({ embeds: [embed], components: [] }).catch(e=>{});

	infostuffs.push(a.id, [ctx.author, page]);
	setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command({name: "leaderboard", aliases: ["lb"]}, data);
