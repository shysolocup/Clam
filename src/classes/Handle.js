const { Embed } = require('../packages/discordpps');
var { colors, emojis } = require('../assets');

class Handle {
    constructor(type, contents={ head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null }) {
        let emoji = (contents.emoji) ? contents.emoji : (type==0) ? emojis.fail : emojis.success;
        let color = (contents.color) ? contents.color : (type==0) ? colors.fail : colors.success;
        
        return [
            new Embed({
                title: contents.head,
                description: `${emoji}  ${contents.text}`,

                fields: contents.fields,

                author: contents.author,
                footer: contents.footer,

                ephemeral: true,
                color: color
            }) 
        ];
    }
}

module.exports = { Handle };
