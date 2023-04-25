var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji, infostuffs } = require('../assets/index.js');
var { Clanner } = require('../classes/index.js');

const { Soup } = require('stews');

async function data(ctx) {
    const buttonID = ctx.customId;

    if (buttonID == "inviteAccept") {
        /* handling */
        if (!infostuffs.has(ctx.message.id)) {
            return ctx.reply({ embeds: [
                new psc.Embed({
                    description: `${declineEmoji} Command timed out.`,
                    color: colors.decline,
                    ephemeral: true
                })
            ]});
        }

        let [reciever, clan] = infostuffs.get(ctx.message.id);
        var clans = new Clanner();

        if (!clans.has(clan.id)) {
            return ctx.reply({ embeds: [
                new psc.Embed({
                    description: `${declineEmoji} Clan has been deleted or altered.`,
                    color: colors.decline,
                    ephemeral: true
                })
            ]});
        }

        if (reciever.id != ctx.member.id) {
            return ctx.reply({ embeds: [
                new psc.Embed({
                    description: `${declineEmoji} That's not for you. :angry:`,
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
            description: `${acceptEmoji}  Welcome to the '${clan.name}' club <@${reciever.id}>!`,
            footer: `( id: ${clan.id} )`,
            color: colors.accept
        });


        ctx.update({ embeds: [embed], components: [row] });

        clans.join(clan.id, reciever.id);
    }
}


psc.buttonAction(data);
