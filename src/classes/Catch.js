const { Embed } = require('../packages/discordpps');

class Catch {
    constructor(call, contents={ head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null }) {

        var { colors, emojis } = require('../assets');
        var { psc } = require('../../index.js');

        let emoji = (contents.emoji) ? contents.emoji : (call) ? emojis.decline : emojis.accept;
        let color = (contents.color) ? contents.color : (call) ? colors.decline : colors.accept;
        let time = (contents.time) ? contents.time : "3s";
        
        return (call) ? psc.reply({
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

        : {};
    }
}

module.exports = { Catch };
