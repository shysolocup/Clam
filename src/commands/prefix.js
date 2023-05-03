var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');
var { Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	/* handling */
    let disabled = !(psc.author.hasPermissions(["admin"]));

	if ( 
        Catch( disabled, { post: false }) ||

        Catch( cmd.onCooldown, { 
		    head: `Woah there!  :face_with_spiral_eyes:`,
		    text: `You've been timed out from using this command for a bit.`,
	    })
        
    ) return;


    let prefix = cmd.args[0];

    var prefixes = Soup.from(require('../../config/prefixes.json'));
    prefixes[ctx.guild.id] = prefix;
    prefixes.dump("./config/prefixes.json", null, 4);

	
	const embed = new psc.Embed({
		description: `${emojis.success} Set the guild's prefix to ${"`"+prefix+"`"}`,
		color: colors.success
	});

	ctx.reply({ embeds: [embed] }).catch(e=>{});
}

psc.command({ name: "prefix", cooldown: "30s"}, data);
