var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, emojis, infostuffs } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');

async function data(ctx, cmd) {
	let clans = new Clanner();
	let id = cmd.args[0];
	
	
	/* handling */
	if (
		Catch( !id, { text: "Please put a clan ID."}) ||
		Catch( !clans.has(id, ctx.guild.id), { text: "There is no clan with that ID." })
		
	) { return }


	/* the stuff */
	let clan = clans.fetch(id, ctx.guild.id);
	
	let name = (clan.gold) ? `${clan.name}  ${emojis.gold}` : clan.name;
	let members = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;
	let ops = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
	let status = clans.status(clan.status);
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
			
			
			color: (clan.color == "rank") ? colorify(clan.funds)[0] : clan.color,
			thumbnail: icon,
			image: banner
	});
	
	
	let a = await ctx.reply( {embeds: [embed], components: [row]} ).catch(e=>{});
	

	infostuffs.push(a.id, [ ctx.author, clan ]);
	setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command("get", data);
