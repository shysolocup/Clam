const { Soup } = require('stews');
var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji, infostuffs } = require('../assets');
var { Clanner } = require('../classes');

async function data(ctx, cmd) {
	let clans = new Clanner();
	let id = cmd.args[0];
	
	/* handling */
	if (!id) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Please put a clan ID.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}
	if (!clans.has(id, ctx.guild.id)) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} There is no clan with that ID.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}

    let clan = clans.fetch(id);
    
    if (clan.status == 2 || clan.status == 3) {
    	return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} This clan is invite only.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
    }

    if (clan.members.includes(ctx.author.id)) {
        return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} You're already in that clan.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
    }
    

	/* embed and death */
	let embed = new psc.Embed({
		color: colors.success,
		title: "Joining  👥",
		description: `${acceptEmoji} Welcome to the ${ "`"+clan.name+"`" } club <@${ctx.author.id}>`,
		footer: `( id: ${id} )`
	});


    ctx.reply( {embeds: [embed] });
}

psc.command("join", data);
