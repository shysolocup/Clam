var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, emojis, infostuffs } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx) {
    const buttonID = ctx.customId;

    if (buttonID == "clanHome" || buttonID == "clanStats" || buttonID == "clanEconomy") {
        stuff(ctx);
    }
}


psc.buttonAction(data);


/* stuff */
async function stuff(ctx) {
	let clans = new Clanner();
	
	
	/* handling */
	if ( Catch( !infostuffs.has(ctx.message.id), { text: "Command timed out.", poster: ctx.reply.bind(ctx) }) ) return;

	
	let [ user, clan ] = infostuffs.get(ctx.message.id);
    let id = clan.id;
	
	
	/* more handling */
	if ( 
		Catch( user.id != ctx.member.id, { text: "That's not for you. :angry:", poster: ctx.reply.bind(ctx) }) ||
		Catch( !id, { text: "Please put a clan ID.", poster: ctx.reply.bind(ctx) }) ||
		Catch( !clans.has(id), { text: "Clan has been deleted or altered.", poster: ctx.reply.bind(ctx) })
	) return;


	/* the stuff */
	let name = (clan.gold) ? `${clan.name}  ${emojis.gold}` : clan.name;
	let members = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;
	let ops = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
	let status = clans.status(clan.status);
	let shout = `"${clan.shout.content}" - <@${clan.shout.author}>`;
	
	let icon = Soup.from(clan.icon).replaceAll(" ", "_").join("");
	let banner = Soup.from(clan.banner).replaceAll(" ", "_").join("");
	
	
	/* buttons */
	let homeButton = new psc.Button({ id: "clanHome", emoji: "🏡", style: (ctx.customId == "clanHome") ? "primary" : "secondary" });
	let statsButton = new psc.Button({ id: "clanStats", emoji: "📊", style: (ctx.customId == "clanStats") ? "primary" : "secondary" });
	let economyButton = new psc.Button({ id: "clanEconomy", emoji: "💰", style: (ctx.customId == "clanEconomy") ? "primary" : "secondary" });

    let row = new psc.ActionRow([ homeButton, statsButton, economyButton ]);


    /* fields */
    var fields;
    if (ctx.customId == "clanHome") {
        fields = [
            { name:"** **\nShout:", value: shout , inline: false},
            { name:"** **", value: "** **", inline: false},
            { name:"Owner", value: `<@${clan.owner}>`, inline: true},
            { name:"** **", value: "** **", inline: true},
            { name:"Operators", value: `${ops}`, inline: true},
            { name:"** **", value: "** **", inline: false}
        ];
    }
    else if (ctx.customId == "clanStats") {
        fields = [
            { name:"** **", value: "** **", inline: false},
            { name:"Members", value: `${members}`, inline: true},
            { name:"Member Count", value: `${clan.members.length}`, inline: true},
            { name:"** **", value: "** **", inline: false},
        ];
    }
    else if (ctx.customId == "clanEconomy") {
        fields = [
            { name:"** **", value: "** **", inline: false},
			{ name:"Funds", value: "`"+pearl+pearlify(clan.funds)+"`", inline: true},
			{ name:"Rank", value: "`"+colorify(clan.funds)[1]+"`", inline: true},
			{ name:"** **", value: "** **", inline: false},
        ];
    }
	
	
	/* the */
	let embed = new psc.Embed({
			title: name,
			description: `${clan.description}\n\n`,
			
			
			fields: fields,
			
			
			footer: {text: (ctx.guild.id == clan.guild) ? `( id: ${id} )` : `( guild id: ${clan.guild} )\n( clan id: ${id} )`},
			author: {name: `• ${status} •`},
			
			
			color: (clan.color == "rank") ? colorify(clan.funds)[0] : clan.color,
			thumbnail: icon,
			image: banner
	});
	
	
	return ctx.update( {embeds: [embed], components: [row]} ).catch(e=>{});
}
