var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx) {
    const buttonID = ctx.customId;

    if (buttonID == "disbandAccept") {
        /* handling */
        if ( Catch( !infostuffs.has(ctx.message.id), { text: "Command timed out.", poster: ctx.reply.bind(ctx) }) ) return;

            
        let clan = infostuffs.get(ctx.message.id);
        var clans = new Clanner();
		
        
        /* more handling */
        if (
            Catch( !clans.has(clan.id), { text: "Clan has been deleted or altered.", poster: ctx.reply.bind(ctx) }) ||
            Catch( clan.owner != ctx.member.id, { text: "That's not for you. :angry:", poster: ctx.reply.bind(ctx) })
        ) return;
        
        
        /* getting/setting button stuff */
        let buttons = ctx.message.components[0].components;
        buttons.forEach( (button) => { button.data.disabled = true; });
        buttons = buttons.map( (button) => { return button.data; });
        let row = new psc.ActionRow(buttons);


        let embed = new psc.Embed({
            title: `Clan Disbanding  🗑️`,
            description: `${emojis.success} Disbanded ${clan.name}`,

            footer: `( id: ${clan.id} )`,

            color: colors.success
        });


        ctx.update({ embeds: [embed], components: [row] }).catch(e=>{});

        clans.disband(clan.id, ctx.guild.id);
    }
}


psc.buttonAction(data);
