var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');
var { Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	/* handling */
    let disabled = !(psc.author.hasPermissions(["admin"]));
    var prefixes = Soup.from(require('../../config/prefixes.json'));

	if ( 
        Catch( disabled && cmd.args.length > 0, { post: false }) ||

        Catch( cmd.onCooldown, { 
		    head: `Woah there!  :face_with_spiral_eyes:`,
		    text: `You've been timed out from using this command for a bit.`,
	    })
        
    ) return;


    let original = ( prefixes instanceof Object && prefixes[ctx.guild.id] ) ? prefixes[ctx.guild.id] : (prefixes instanceof Object) ? prefixes.default : prefixes;
    let prefix = cmd.args[0];

    if (prefix == "default") prefix = "!";

    if ( Catch( !prefix, { text: `This server's prefix is ${"`"+original+"`"}`, color: colors.blurple, delete: false, textEmoji: false } )) return

    prefixes[ctx.guild.id] = prefix;
    prefixes.dump("./config/prefixes.json", null, 4);

	
	const embed = new psc.Embed({
		description: `${emojis.success} Set the server's prefix to ${"`"+prefix+"`"}`,
		color: colors.success
	});

	ctx.reply({ embeds: [embed] }).catch(e=>{});
}

psc.command({ name: "prefix", cooldown: "30s"}, data);
