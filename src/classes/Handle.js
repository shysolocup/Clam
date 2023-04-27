const { Embed } = require('../packages/discordpps');

class Handle {
    constructor(bool, handles = { 
            pass: { head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null },
            fail: { head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null }
        }) {

        var { colors, emojis } = require('../assets');

        var contents = (bool) ? handles.pass : handles.fail;

        let emoji = (contents.emoji) ? contents.emoji : (bool) ? emojis.accept : emojis.decline;
        let color = (contents.color) ? contents.color : (bool) ? colors.accept : colors.decline;
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
