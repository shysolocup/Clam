const { Embed } = require('../packages/discordpps');

class Handle {
    constructor(call, handles={ 
            pass: { head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null },
            fail: { head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null }
        }) {

        var { colors, emojis } = require('../assets');

        var contents = (call) ? handles.fail : handles.pass;

        let emoji = (contents.emoji) ? contents.emoji : (call) ? emojis.decline : emojis.accept;
        let color = (contents.color) ? contents.color : (call) ? colors.decline : colors.accept;
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
