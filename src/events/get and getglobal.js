var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, goldEmoji, declineEmoji, infostuffs } = require('../assets');
var { Clanner } = require('../classes');

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

	if (!infostuffs.has(ctx.message.id)) {
		return ctx.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Command timed out.`,
				color: colors.decline,
                ephemeral: true
			})
		]});
	}

	let [ user, clan ] = infostuffs.get(ctx.message.id);
    let id = clan.id;
	
	/* handling */
	if (user.id != ctx.member.id) {
		return ctx.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} That's not for you. :angry:`,
				color: colors.decline,
				ephemeral: true
			})
		]});
	}
	if (!id) {
		return ctx.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Please put a clan ID.`,
				color: colors.decline,
                ephemeral: true
			})
		]});
	}
	if (!clans.has(id)) {
		return ctx.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Clan has been deleted or altered.`,
				color: colors.decline,
                ephemeral: true
			})
		]});
	}


	/* the stuff */
	let name = (clan.gold) ? `${clan.name}  ${goldEmoji}` : clan.name;
	let members = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;
	let ops = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
	let status = (clan.status == 1) ? "Public" : "Private";
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
	
	
	return ctx.update( {embeds: [embed], components: [row]} );
}
