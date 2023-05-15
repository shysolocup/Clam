const { Soup } = require('stews');

class Inventory {
    constructor(ctx, userID) {
        var inv = Soup.from(require('../data/inventories.json'));

        if (!inv.has(ctx.guild.id)) inv.push(ctx.guild.id, new Soup(Object));
        var parent = Soup.from(inv.get(ctx.guild.id));

        if (!parent.has(userID)) parent.push(userID, []);
        
        inv.dump('./src/data/inventories.json', null, 4);


        return this;
    }
}


module.exports = { Inventory };
