const { Soup } = require('stews');

class Hand {
    constructor(ctx) {
        var hands = Soup.from(require('../data/economy.json'));

        if (!hands.has(ctx.author.id)) hands.push(ctx.author.id, 0);

        hands.dump('./src/data/economy.json', null, 4);

        this.balance = 0;
        this.user = ctx.author;

        return this;
    }
}

module.exports = { Hand };
