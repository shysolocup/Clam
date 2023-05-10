var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, emojis, infostuffs, isDev } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx) {
    const buttonID = ctx.customId;

    if (buttonID.startsWith("clanGet/")) {
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

	let category = ctx.customId.split("clanGet/")[1];
	
	
	/* more handling */
	if ( 
		Catch( user.id != ctx.member.id, { text: "That's not for you. :angry:", poster: ctx.reply.bind(ctx) }) ||
		Catch( !id, { text: "Please put a clan ID.", poster: ctx.reply.bind(ctx) }) ||
		Catch( !clans.has(id), { text: "Clan has been deleted or altered.", poster: ctx.reply.bind(ctx) })
	) return;


	/* the stuff */
	try {
		var name = (clan.gold) ? `${clan.name}  ${emojis.gold}` : clan.name;
		var members = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;
		var ops = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
		var status = clans.status(clan.status);
		var shout = `"${clan.shout.content}" - <@${clan.shout.author}> ${clan.shout.timestamp}`;
	
		var allies = (clan.allies.length == 0) ? "None" : clan.allies.map( (v) => { return `${clans.fetch(v).name} (${"`"+v+"`"})`; }).join("\n");
		var enemies = (clan.enemies.length == 0) ? "None" : clan.enemies.map( (v) => { return `${clans.fetch(v).name} (${"`"+v+"`"})`; }).join("\n");
		
		var icon = Soup.from(clan.icon).replaceAll(" ", "_").join("");
		var banner = Soup.from(clan.banner).replaceAll(" ", "_").join("");
	}
	catch(err) {
		return Catch( true, { text: "A required part of the clan has been removed or altered.", poster: ctx.reply.bind(ctx) });
	}
		
		
	/* buttons */
	let homeButton = new psc.Button({ id: "clanGet/Home", emoji: "🏡", style: (category == "Home") ? "primary" : "secondary" });
	let statsButton = new psc.Button({ id: "clanGet/Stats", emoji: "📊", style: (category == "Stats") ? "primary" : "secondary" });
	let economyButton = new psc.Button({ id: "clanGet/Economy", emoji: "🛍️", style: (category == "Economy") ? "primary" : "secondary" });
	let alliancesButton = new psc.Button({ id: "clanGet/Alliances", emoji: "⚔️", style: (category == "Alliances") ? "primary" : "secondary" });

    let row = new psc.ActionRow([ homeButton, statsButton, economyButton, alliancesButton ]);


    /* fields */
    var fields;
    if (category == "Home") {
        fields = [
            { name:"** **\nShout:", value: shout , inline: false},
            { name:"** **", value: "** **", inline: false},
            { name:"Owner", value: `<@${clan.owner}>`, inline: true},
            { name:"** **", value: "** **", inline: true},
            { name:"Operators", value: `${ops}`, inline: true},
            { name:"** **", value: "** **", inline: false}
        ];
    }
    else if (category == "Stats") {
        fields = [
            { name:"** **", value: "** **", inline: false},
            { name:"Members", value: `${members}`, inline: true},
            { name:"Member Count", value: `${clan.members.length}`, inline: true},
            { name:"** **", value: "** **", inline: false},
        ];
    }
    else if (category == "Economy") {
        fields = [
            { name:"** **", value: "** **", inline: false},
			{ name:"Funds", value: "`"+pearl+pearlify(clan.funds)+"`", inline: true},
			{ name:"Rank", value: "`"+colorify(clan.funds)[1]+"`", inline: true},
			{ name:"** **", value: "** **", inline: false},
        ];
    }
	else if (category == "Alliances") {
        fields = [
            { name:"** **", value: "** **", inline: false},
            { name:"Allies", value: `${allies}`, inline: true},
			{ name:"Enemies", value: `${enemies}`, inline: true},
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
