const { Soup } = require('stews');

class ItemTemplate {
    constructor(ctx, clanID, name=null) {
        var prefixes = require('../../config/prefixes.json');
        var prefix = (prefixes instanceof Object && prefixes[ctx.guild.id]) ? prefixes[ctx.guild.id] : (prefixes instanceof Object) ? prefixes.default : prefixes;
		
        return new Soup({
            name: (name) ? name : `New Item`,
            description: `Use `+"`"+`${prefix}item set`+"`"+` to change things to your liking!`,
            creator: ctx.author.id,
            guild: ctx.guild.id,
            clan: clanID,
            roles: {
                add: [],
                remove: []
            },
            price: 0
        });  
        
    }
}

module.exports = { ItemTemplate };
