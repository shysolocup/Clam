/* THIS IS A DEV/ADMIN ONLY COMMAND AND THUS ONLY SHOWS UP IN THE LOCKED ADMINISTRATOR SECTION */

var { psc, bot } = require('../../index.js');
var { AttachmentBuilder } = require('discord.js');
var { colors, emojis, isDev } = require('../assets');

var { Catch, Clanner } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
    /* handling */
	let disabled = !(psc.author.hasPermissions(["admin"]) || isDev(ctx.author.id));
    if ( 
		Catch( disabled, { post: false }) ||

		Catch( cmd.onCooldown, { 
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		})
	) return;


    /* attachment building */
    let clans = (new Clanner()).in(ctx.guild.id);
    var attachment = new AttachmentBuilder(Buffer.from(`${ clans.stringify(null, 4) }`, 'utf-8'), {name: 'clans.json'});


	/* the dming */
	try {
		await ctx.author.send({
            content: "Here's your raw clan JSON. (***WARNING:** Unless you know what you're doing DO NOT change anything!*)",
            files: [attachment]
        })
	}
	catch(err) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${emojis.fail} Your DMs are off so I can't send you the export :(`,
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

psc.command("export", data);
