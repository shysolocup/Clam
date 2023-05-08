var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, emojis, infostuffs, isDev } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');

async function data(ctx, cmd) {
	let clans = new Clanner();
	let [id, setting] = cmd.args;
	
	
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

        var color = (clan.color.toLowerCase() == "rank") ? colorify(clan.funds)[0] : clan.color; 
	}
	catch(err) {
		return Catch( true, { text: "A required part of the clan has been removed or altered.", poster: ctx.reply });
	}


    var prefixes = require('../../config/prefixes.json');
	var prefix = (prefixes instanceof Object && prefixes[ctx.guild.id]) ? prefixes[ctx.guild.id] : (prefixes instanceof Object) ? prefixes.default : prefixes;
	
	
	/* embed stuff */
    var embed;

    if (setting) {
        let settings = new Soup({
            status: [ "`"+status+"`", "Public private or unlisted status is mostly for clan visibility and invite only clans." ],
            icon: [ `[Link](${icon})`, "The clan's icon/thumbnail if resize is true it automatically resizes to 500x500." ],
            banner: [ `[Link](${banner})`, "The clan's banner/image if resize is true it automatically resizes to 1500x500." ],
            funds: [ `${"`"+pearl}${pearlify(clan.funds)+"`"}`, "The clan's pearls earned from donations or from shop purchases that can be withdrawn by the owner of the clan." ],
            rank: [ "`"+colorify(clan.funds)[1]+"`", "The clan's rank depends on the funds and for users it increases the amount earned." ],
            color: [ "`"+color+"`"+`${(clan.color.toLowerCase() == "rank") ? " (rank)" : ""}`, `The clan's color that shows up on the clan's ${prefix}get embed page.` ],
            gold: [ "`"+clan.gold+"`", `Given to specific clans using the ${prefix}gold command it gives people in the clan x1.5 more earnings from ${prefix}work, ${prefix}crime, and ${prefix}steal` ],
            resize: [ "`"+clan.resize+"`", `True or false that decides if it should automatically resize images given from the ${prefix}set command` ]
        });

        if ( Catch( !settings.includes(setting.toLowerCase()), { text: "There is no setting with that name" }) ) return;

        let thing = settings.get(setting.toLowerCase());

        embed = new psc.Embed({
            title: `${name} // ${setting.toLowerCase()}`,
            
            fields: [
                { name: "Description:", value: thing[1], inline: false },
                { name: "Value:", value: thing[0], inline: false },
                { name: "** **", value: "** **", inline: false }
            ],

            footer: `( id: ${id} )`,
            color: color
        });
    }
    else {
        embed = new psc.Embed({
            title: `${name}`,
            description: clan.description,
    
            fields: [
                { name: "Status:", value: "`"+status+"`", inline: true },
                { name: "Icon:", value: `[Link](${icon})`, inline: true },
                { name: "Banner:", value: `[Link](${banner})`, inline: true },
                { name: "Funds:", value: `${"`"+pearl}${pearlify(clan.funds)+"`"}`, inline: true },
                { name: "Rank:", value: "`"+colorify(clan.funds)[1]+"`", inline: true },
                { name: "Color:", value: "`"+color+"`"+`${(clan.color.toLowerCase() == "rank") ? " (rank)" : ""}`, inline: true },
                { name: "Gold:", value: "`"+clan.gold+"`", inline: true },
                { name: "Resize:", value: "`"+clan.resize+"`", inline: true },
                { name: "** **", value: "** **", inline: false }
            ],
    
            footer: `( id: ${id} )`,
            color: color
        });
    }
	
	
    ctx.reply( { embeds: [embed] } ).catch(e=>{});
}

psc.command("settings", data);
