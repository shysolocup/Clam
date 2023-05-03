var { psc, bot } = require('../../index.js');
var { emojis } = require('../assets');
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
		
		var icon = Soup.from(clan.icon).replaceAll(" ", "_").join("");
		var banner = Soup.from(clan.banner).replaceAll(" ", "_").join("");
	}
	catch(err) {
		return Catch( true, { text: "A required part of the clan has been removed or altered.", poster: ctx.reply });
    }
    
    ctx.reply({
        content: `Here's the icon for ${clan.name}:`,
        files: [{ attachment: icon, name: `clan-icon.png` }]
    })
}

psc.command("icon", data);
