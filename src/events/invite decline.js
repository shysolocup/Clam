var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets/index.js');
var { Clanner } = require('../classes/index.js');

const { Soup } = require('stews');


async function data(ctx) {
    const buttonID = ctx.customId;

    if (buttonID == "inviteDecline") {
        /* handling */
        if (!infostuffs.has(ctx.message.id)) {
            return ctx.reply({ embeds: [
                new psc.Embed({
                    description: `${emojis.decline} Command timed out.`,
                    color: colors.decline,
                    ephemeral: true
                })
            ]});
        }

	   
	/* stuff */
        let [reciever, clan] = infostuffs.get(ctx.message.id);
        var clans = new Clanner();

	
	/* more handling */
        if (!clans.has(clan.id)) {
            return ctx.reply({ embeds: [
                new psc.Embed({
                    description: `${emojis.decline} Clan has been deleted or altered.`,
                    color: colors.decline,
                    ephemeral: true
                })
            ]});
        }

        if (reciever.id != ctx.member.id) {
            return ctx.reply({ embeds: [
                new psc.Embed({
                    description: `${emojis.decline} That's not for you. :angry:`,
                    color: colors.decline,
                    ephemeral: true
                })
            ]});
        }
        
        /* getting/setting button stuff */
        let buttons = ctx.message.components[0].components;
        buttons.forEach( (button) => { button.data.disabled = true; });
        buttons = buttons.map( (button) => { return button.data; });
        let row = new psc.ActionRow(buttons);


        let embed = new psc.Embed({
            title: "Invite  :tada:",
            description: `${emojis.decline}  Looks like <@${reciever.id}> doesn't wanna party with you guys :(`,
            footer: `( id: ${clan.id} )`,
            color: colors.decline
        });


        ctx.update({ embeds: [embed], components: [row] });
    }
}


psc.buttonAction(data);
