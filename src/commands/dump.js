/* THIS IS A DEVELOPER ONLY COMMAND AND THUS IS NOT LISTED IN !HELP */

var { psc, bot } = require('../../index.js');
var { AttachmentBuilder } = require('discord.js');
var { colors, emojis, isDev, infostuffs } = require('../assets');

var { Catch } = require('../classes');


async function data(ctx, cmd) {
    /* handling */
    if ( 
		Catch( !isDev(ctx.author.id), { post: false }) ||

		Catch( cmd.onCooldown, { 
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		})
	) return;


    /* attachment building */
    var attachment = new AttachmentBuilder(Buffer.from(`${ infostuffs.stringify(null, 4) }`, 'utf-8'), {name: 'infostuffs.json'});


	/* the dming */
	try {
		await ctx.author.send({
            content: "Here's your infostuffs dump.",
            files: [attachment]
        })
	}
	catch(err) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${emojis.fail} Your DMs are off so I can't send you the dump :(`,
				color: colors.fail
			})
		], deleteAfter: "3s" }).catch(e=>{});
	}

    
	psc.reply({embeds: [{
		color: 0x3498DB,
		description: `Check the DM I sent you!`,
	}],
		deleteAfter: "5s"
	}).catch(e=>{});
}


psc.command("dump", data);
