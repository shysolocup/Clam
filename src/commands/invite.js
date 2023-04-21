const { Soup } = require('stews');
var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji, infostuffs } = require('../assets');
var { Clanner } = require('../classes');

async function data(ctx, cmd) {
	if (cmd.onCooldown) {
		return psc.reply({embeds: [
			new psc.Embed({
				title: "Woah there!  :face_with_spiral_eyes:",
				description: `${declineEmoji} You've been timed out from using this command for a bit.`,
				color: colors.decline
			})
		],
			deleteAfter: "3s"
		});
	}
	

	let clans = new Clanner();
	let [user, id] = cmd.args;

    user = psc.fetchUser(user);


    /* handling */
	if (!user) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Please put a valid user`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}
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

    if (clan.members.includes(user.id)) {
        return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} User is already in the clan.`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
    }


    /* buttons n stuff */
    let inviteAccept = new psc.Button({ id: "inviteAccept", label: "Accept", style: "success"});
    let inviteDecline = new psc.Button({ id: "inviteDecline", label: "Decline", style: "danger"});

    let row = new psc.ActionRow([ inviteAccept, inviteDecline ]);


	/* embed and death */
	let embed = new psc.Embed({
		color: colors.blurple,
		title: "Invite  :tada:",
		description: `Hey <@${user.id}>! You were invited to join ${clan.name} by <@${ctx.author.id}>!`,
		footer: `( id: ${id} )`
	});


    let a = await ctx.reply( {embeds: [embed], components: [row]} );

    
    infostuffs.push(a.id, [user, clan]);
    setTimeout(() => infostuffs.delete(a.id), 21600000);

}

psc.command({ name: "invite", aliases: ["inv"], cooldown: "10s"}, data);
