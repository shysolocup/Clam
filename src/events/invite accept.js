var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx) {
    const buttonID = ctx.customId;

    if (buttonID == "inviteAccept") {
        /* handling */
        if ( Catch( !infostuffs.has(ctx.message.id), { text: "Command timed out.", poster: ctx.reply.bind(ctx) }) ) return;

            
        let [reciever, clan] = infostuffs.get(ctx.message.id);
        var clans = new Clanner();
		
        
        /* more handling */
        if (
            Catch( !clans.has(clan.id), { text: "Clan has been deleted or altered.", poster: ctx.reply.bind(ctx) }) ||
            Catch( reciever.id != ctx.member.id, { text: "That's not for you. :angry:", poster: ctx.reply.bind(ctx) })
        ) return;
        
        
        /* getting/setting button stuff */
        let buttons = ctx.message.components[0].components;
        buttons.forEach( (button) => { button.data.disabled = true; });
        buttons = buttons.map( (button) => { return button.data; });
        let row = new psc.ActionRow(buttons);


        let embed = new psc.Embed({
            title: "Invite  :tada:",
            description: `${emojis.accept}  Welcome to the '${clan.name}' club <@${reciever.id}>!`,
            footer: `( id: ${clan.id} )`,
            color: colors.accept
        });


        ctx.update({ embeds: [embed], components: [row] }).catch(e=>{});

        clans.join(clan.id, reciever.id, ctx.guild.id);
    }
}


psc.buttonAction(data);
