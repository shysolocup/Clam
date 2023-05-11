/* THIS IS A DEV/ADMIN ONLY COMMAND AND THUS ONLY SHOWS UP IN THE LOCKED ADMINISTRATOR SECTION */

var { psc, bot } = require('../../index.js');
var { colors, emojis, isDev } = require('../assets');

var { Catch, Clanner } = require('../classes');

const fetch = import('node-fetch');
const { Soup } = require('stews');


async function data(ctx, cmd) {
    /* handling */
    let owner = await ctx.guild.fetchOwner();
	let disabled = !(ctx.author.id == owner || isDev(ctx.author.id));
    if ( 
		Catch( disabled, { post: false }) ||

		Catch( cmd.onCooldown, { 
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		})
	) return;


    let link = (ctx.attachments.length > 0) ? ctx.attachments.first().url : (cmd.args[0]) ? cmd.args[0] : null;
    if ( Catch( !link, { text: "Please put a file (link or attachment)" }) ) return;

    var clans = Soup.from(require('../data/clans.json')); 
    var copy = clans.copy();

    var changed = copy.length - clans.length;


    /* gets the JSON data from the link */
    try {
        await fetch(link, { method: "Get" } )
            .then(res => res.json())
            .then((json) => {
                let data = Soup.from(json);
                
                clans[ctx.guild.id] = data;

                clans.dump("./src/data/clans.json", null, 4);
        });
    }

    catch(e) { console.log("something with the fetch") }


    let embed = new psc.Embed({
        description: `${emojis.success} Successfully overwritted all clans in ${"`"+ctx.guild.name+"`"}.`,

        author: { name: `${ (changed >= 0) ? `+${change}` : change }`, icon: ctx.guild.iconURL() },

        color: colors.success
    });

    ctx.delete().catch(e=>{});
    ctx.channel.send({ embeds: [embed] }).catch(e=>{});
}


psc.command("import", data);
