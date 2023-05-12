var { psc, bot } = require('../../index.js');
var { colors, infostuffs } = require('../assets');
var { Soup } = require('stews');

async function data(ctx) {
    var buttonID = ctx.customId;

	if (buttonID.includes("clamLB/switch")) {
		const { Econner, Catch } = require('../classes');
        let econner = new Econner();


		/* handling */
		if ( Catch( !infostuffs.has(ctx.message.id), { text: "Command timed out.", poster: ctx.reply.bind(ctx) }) ) return;


		/* stuff */
		var [ user, section, page ] = infostuffs.get(ctx.message.id);
        page = 1;


		/* more handling */
        if ( Catch( user.id != ctx.member.id, { text: "That's not for you. :angry:", poster: ctx.reply.bind(ctx) }) ) return;


        /* getting the leaderboards */
        var clanLB = await econner.clanLB(ctx.guild.id, ctx.member.id);
        var userLB = await econner.userLB(ctx.guild.id, ctx.member.id);


        let guild = ctx.guild.name.split("");
        guild[0] = guild[0].toUpperCase();
        guild = guild.join("");


        section = (section == "user") ? "clan" : "user";


        /* button stuff */
        var disabled = ((section == "user") ? userLB.total : clanLB.total) <= 0;

        let bigLeftButton = new psc.Button({ id: "clamLB/bigLeft", emoji: "⏮️", style: "secondary", disabled: disabled });
        let leftButton = new psc.Button({ id: "clamLB/left", emoji: "◀", style: "secondary", disabled: disabled });
        let rightButton = new psc.Button({ id: "clamLB/right", emoji: "▶", style: "secondary", disabled: disabled });
        let bigRightButton = new psc.Button({ id: "clamLB/bigRight", emoji: "⏭️", style: "secondary", disabled: disabled });

        let switchButton = new psc.Button({ id: `clamLB/switch`, emoji: (section == "user") ? "🛡️" : "👥", style: "secondary" });
        
        let row = new psc.ActionRow([ bigLeftButton, leftButton, switchButton, rightButton, bigRightButton ]);


        /* embed stuff */
        let embed = new psc.Embed({
            author: { name: `${guild} Leaderboards` },

            title: (section == "user") ? "Users Leaderboard" : "Clans Leaderboard",
            description: `${ (section == "user") ? 
                ((userLB.total <= 0) ? "None" : `${userLB.page(page).join("\n")}\n** **`) : 
                ((clanLB.total <= 0) ? "None" : `${clanLB.page(page).join("\n")}\n** **`)
			}\n** **`,

            footer: `Page ${page}/${ (section == "user") ? userLB.pages : clanLB.pages }`,

            thumbnail: ctx.guild.iconURL(),
            color: colors.clam
        });


        ctx.update({ embeds: [embed], components: [row] }).catch(e=>{});

        infostuffs.set(ctx.message.id, [user, section, page]);
    }
}

psc.buttonAction(data);
