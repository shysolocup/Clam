var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, goldEmoji, acceptEmoji, declineEmoji, infostuffs } = require('../assets');
var { Clanner } = require('../classes');

const { Soup } = require('stews');

async function data(ctx, cmd) {
	let clans = new Clanner();
	let id = cmd.args[0];
	
	
	/* handling */
	if (!id) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Please put a clan ID.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}
	if (!clans.has(id, ctx.guild.id)) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} There is no clan with that ID.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}


	/* the stuff */
	let clan = clans.fetch(id, ctx.guild.id);
	
	let name = (clan.gold) ? `${clan.name}  ${goldEmoji}` : clan.name;
	let members = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;
	let ops = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
	let status = (clan.status == 1) ? "Public" : "Private";
	let shout = `"${clan.shout.content}" - <@${clan.shout.author}>`;
	
	let icon = Soup.from(clan.icon).replaceAll(" ", "_").join("");
	let banner = Soup.from(clan.banner).replaceAll(" ", "_").join("");
	
	
	/* buttons */
	let homeButton = new psc.Button({ id: "clanHome", emoji: "🏡", style: "primary" });
	let statsButton = new psc.Button({ id: "clanStats", emoji: "📊", style: "secondary" });
	let economyButton = new psc.Button({ id: "clanEconomy", emoji: "💰", style: "secondary" });
	
	let row = new psc.ActionRow([ homeButton, statsButton, economyButton ]);
	
	
	/* the */
	let embed = new psc.Embed({
			title: name,
			description: `${clan.description}\n\n`,
			
			
			fields: [
				
				{ name:"** **\nShout:", value: shout , inline: false},
				{ name:"** **", value: "** **", inline: false},
				{ name:"Owner", value: `<@${clan.owner}>`, inline: true},
				{ name:"** **", value: "** **", inline: true},
				{ name:"Operators", value: `${ops}`, inline: true},
				{ name:"** **", value: "** **", inline: false},
				
				/*
				{ name:"** **", value: "** **", inline: false},
				{ name:"Members", value: `${members}`, inline: true},
				{ name:"Member Count", value: `${clan.members.length}`, inline: true},
				{ name:"** **", value: "** **", inline: false},
				*/
				/*
				{ name:"** **", value: "** **", inline: false},
				{ name:"Funds", value: "`"+pearl+pearlify(clan.funds)+"`", inline: true},
				{ name:"Rank", value: "`"+colorify(clan.funds)[1]+"`", inline: true},
				{ name:"** **", value: "** **", inline: false},
				*/
			],
			
			
			footer: {text: (ctx.guild.id == clan.guild) ? `( id: ${id} )` : `( guild id: ${clan.guild} )\n( clan id: ${id} )`},
			author: {name: `• ${status} •`},
			
			
			color: clan.color,
			thumbnail: icon,
			image: banner
	});
	
	
	let a = await ctx.reply( {embeds: [embed], components: [row]} );
	

	infostuffs.push(a.id, clan);
	setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command("get", data);
