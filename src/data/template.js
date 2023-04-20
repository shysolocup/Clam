
const { Soup } = require('stews');
const { icon, banner } = require('../../config/defaults.json');

class ClanTemplate {
    constructor(ctx, id) {
	var nick = (ctx.member.nickname) ? ctx.member.nickname.split("") : ctx.author.username.split("");
	nick[0] = nick[0].toUpperCase();
	nick = nick.join("");
		
        return new Soup({
            id: id.join(""),
            name: `${nick}'s Clan`,
            description: "Welcome to your brand new clan!\nUse !set to change parts of the clan to your liking.",

            shout: new Soup({
                content: "You can use !shout to change the shout.",
                author: "1050917862233100508"
            }),
            
            icon: icon,
            banner: banner,
            color: "#FF523A", /* "RANK" */
            guild: ctx.guild.id,
            owner: ctx.author.id,
            members: [ ctx.author.id ],
            ops: [ ],
            banned: [ ],
            status: 1,
	    funds: 0,
            gold: false
        });
    }
}

module.exports = { ClanTemplate };
