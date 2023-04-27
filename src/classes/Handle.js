const { Embed } = require('../packages/discordpps');

class Handle {
    constructor(type, contents={ head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null }) {
        var { colors, emojis } = require('../assets');
        
        let emoji = (contents.emoji) ? contents.emoji : (type==0) ? emojis.fail : emojis.success;
        let color = (contents.color) ? contents.color : (type==0) ? colors.fail : colors.success;
        let time = (contents.time) ? contents.time : "3s";
        
        return {
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
        };
    }
}

module.exports = { Handle };
