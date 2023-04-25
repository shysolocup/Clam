const { Soup } = require('stews');
const { ClanTemplate } = require('../data/template.js');
const { ID } = require('../stuff.js');

class Clan {
    constructor(ctx, name=null) {
        var clans = Soup.from(require('../data/clans.json'));
        var id = new ID();

        var contents = new ClanTemplate(ctx, id, name);

        if (!clans.has(ctx.guild.id)) clans.push(ctx.guild.id, new Soup(Object));
        var parent = Soup.from(clans.get(ctx.guild.id));

        if (!parent.has(contents.id)) parent.push(contents.id, contents);
        
        clans.dump('./src/data/clans.json', null, 4);

        contents.forEach( (key, value) => {
            this[key] = value;
        });

        return new Proxy(this, ClanProxyHandler());
    }
}

function ClanProxyHandler() {
    return {
        get(target, prop) {
            return target[prop];
        },
		set(target, prop, value) {
			target[prop] = value;
			return true;
		}
    }
}

module.exports = { Clan };
