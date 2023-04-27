const { Embed } = require('../packages/discordpps');

function Catch(call, contents={ head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null }) {
    var { colors, emojis } = require('../assets');
    var { psc } = require('../../index.js');

    let emoji = (contents.emoji) ? contents.emoji : (call) ? emojis.fail : emojis.success;
    let color = (contents.color) ? contents.color : (call) ? colors.fail : colors.success;
    let time = (contents.time) ? contents.time : "3s";
    
    if (call) psc.reply({
        embeds: [
            new Embed({
                title: contents.head,
                description: `${emoji}  ${contents.text}`,

                fields: contents.fields,

                author: contents.author,
                footer: contents.footer,

                ephemeral: true,
                color: color
            })
        ],

        deleteAfter: time
    })

    return call;
}

module.exports = { Catch };
