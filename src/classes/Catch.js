const { Embed } = require('../packages/discordpps');

function Catch(call, contents={ head:null, text:null, footer:null, color:null, emoji:null, fields:null, author:null, time:null, delete:true, poster:null, components:null, files:null, image:null, thumbnail:null, textEmoji:true }) {
    var { colors, emojis } = require('../assets');
    var { psc } = require('../../index.js');


    contents.delete = (contents.delete != undefined) ? contents.delete : true;
    contents.textEmoji = (contents.textEmoji != undefined) ? contents.textEmoji : true;


    let emoji = (contents.emoji) ? contents.emoji : (call) ? emojis.fail : emojis.success;
    let color = (contents.color) ? contents.color : (call) ? colors.fail : colors.success;
    let time = (contents.time && contents.delete) ? contents.time : (contents.delete == false) ? null : "3s";
	let poster = (contents.poster) ? contents.poster : psc.reply;
    

    if (call) poster({
        embeds: [
            new psc.Embed({
                title: contents.head,
                description: (contents.text) ? `${ (contents.textEmoji) ? `${emoji}  ` : ""}${contents.text}` : undefined,

                fields: contents.fields,

                author: contents.author,
                footer: contents.footer,

                image: contents.image,
                thumbnail: contents.thumbnail,
				
                color: color
            })
        ],

        components: contents.components,
        files: contents.files,

		ephemeral: true,
        deleteAfter: time

    }).catch(e=>{});


    return call;
}

module.exports = { Catch };
