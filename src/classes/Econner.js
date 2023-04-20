const { Clanner } = require('./Clanner.js');
const { Soup } = require('stews');

class Econner {
    get all() {
		return Soup.from(require('../data/economy.json'));
	}

	fetchHand(id) {
        var hands = Soup.from(require('../data/economy.json'));
        return hands.get(id);
	}

    fetchClan(id) {
        let clans = new Clanner();
        return clans.fetch(id).funds;
    }

    add(amount, id) {
        var hands = Soup.from(require('../data/economy.json'));
        hands.set(id, (amount+hands.get(id)) );
        hands.dump('./src/data/economy.json', null, 4);
    }

    remove(amount, id) {
        var hands = Soup.from(require('../data/economy.json'));
        hands.set(id, (amount-hands.get(id)) );
        hands.dump('./src/data/economy.json', null, 4);
    }

    set(amount, id) {
        var hands = Soup.from(require('../data/economy.json'));
        hands.set(id, amount);
        hands.dump('./src/data/economy.json', null, 4);
    }
	
	has(id) {
		return Soup.from(require('../data/economy.json')).has(id);
	}
	
}

module.exports = { Econner };
