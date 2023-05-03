const { Soup } = require('stews');
const { ItemTemplate } = require('./ItemTemplate.js');

class Item {
    constructor(ctx, name=null) {
        var items = Soup.from(require('../data/items.json'));

        var contents = new ItemTemplate(ctx, name);

        if (!items.has(ctx.guild.id)) items.push(ctx.guild.id, new Soup(Object));
        var parent = Soup.from(items.get(ctx.guild.id));

        if (!parent.has(contents.name)) parent.push(contents.name, contents),
        
        items.dump('./src/data/items.json', null, 4);

        contents.forEach( (key, value) => {
            this[key] = value;
        });

        return new Proxy(this, ItemProxyHandler());
    }
}

function ItemProxyHandler() {
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

module.exports = { Item };
