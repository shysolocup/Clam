var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, emojis, infostuffs, isDev } = require('../assets');
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

	try {
		var name = (clan.gold) ? `${clan.name}  ${emojis.gold}` : clan.name;
		var status = clans.status(clan.status);
		
		var icon = Soup.from(clan.icon).replaceAll(" ", "_").join("");
		var banner = Soup.from(clan.banner).replaceAll(" ", "_").join("");

        var color = (clan.color.toLowerCase() == "rank") ? colorify(clan.funds)[1] : clan.color; 
	}
	catch(err) {
		return Catch( true, { text: "A required part of the clan has been removed or altered.", poster: ctx.reply });
	}
	
	
	/* embed stuff */
    let embed = new psc.Embed({
        title: `${name}`,
        description: clan.description,

        fields: [
            { name: "Status:", value: "`"+status+"`", inline: true },
            { name: "Icon:", value: `[Link](${icon})`, inline: true },
            { name: "Banner:", value: `[Link](${banner})`, inline: true },
            { name: "Funds:", value: `${"`"+pearl}${pearlify(clan.funds)+"`"}`, inline: true },
            { name: "Rank:", value: "`"+colorify(clan.funds)[1]+"`", inline: true },
            { name: "Color:", value: "`"+color+"`"+(clan.color.toLowerCase() == "rank") ? " (rank)" : "", inline: true },
            { name: "Gold:", value: "`"+clan.gold+"`", inline: true },
            { name: "Resize:", value: "`"+clan.resize+"`", inline: true }
        ],

        footer: `( id: ${id} )`,
        color: color
    });
	
	
    ctx.reply( { embeds: [embed] } ).catch(e=>{});
}

psc.command("settings", data);
