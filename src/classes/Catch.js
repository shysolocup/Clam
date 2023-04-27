const { Embed } = require('../packages/discordpps');

function Catch(call, contents={ head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null, delete:true, poster:null }) {
    var { colors, emojis } = require('../assets');
    var { psc } = require('../../index.js');

    let emoji = (contents.emoji) ? contents.emoji : (call) ? emojis.fail : emojis.success;
    let color = (contents.color) ? contents.color : (call) ? colors.fail : colors.success;
    let time = (contents.time && contents.delete) ? contents.time : (contents.delete == false) ? null : "3s";
	let poster = (contents.poster) ? contents.poster : psc.reply;
    
    if (call) poster({
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
