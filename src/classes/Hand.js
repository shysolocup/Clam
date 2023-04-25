const { Soup } = require('stews');

class Hand {
    constructor(userID) {
        var hands = Soup.from(require('../data/economy.json'));

        if (!hands.has(userID)) hands.push(userID, 0);

        hands.dump('./src/data/economy.json', null, 4);

        return this;
    }
}

module.exports = { Hand };
