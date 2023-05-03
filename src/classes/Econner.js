const { Clanner } = require('./Clanner.js');
const { Soup } = require('stews');

class Econner {
    get all() {
		return Soup.from(require('../data/economy.json'));
	}

	fetchHand(id) {
        let hands = Soup.from(require('../data/economy.json'));
        return hands.get(id);
	}

    fetchClan(id) {
        let clans = new Clanner();
        return clans.fetch(id).funds;
    }

    addHand(amount, id) {
        let hands = Soup.from(require('../data/economy.json'));
        hands.set(id, (amount+hands.get(id)) );
        hands.dump('./src/data/economy.json', null, 4);
    }

    removeHand(amount, id) {
        let hands = Soup.from(require('../data/economy.json'));
        hands.set(id, (amount-hands.get(id)) );
        hands.dump('./src/data/economy.json', null, 4);
    }

    setHand(amount, id) {
        let hands = Soup.from(require('../data/economy.json'));
        hands.set(id, amount);
        hands.dump('./src/data/economy.json', null, 4);
    }

    addClan(amount, id) {
        let clans = new Clanner();
    }
	
	has(id) {
		return Soup.from(require('../data/economy.json')).has(id);
	}

    deposit(amount, userID, clanID) {
        this.removeHand(amount, userID);
	    this.addClan(amount, clanID);
    }
	
	withdraw(amount, userID, clanID) {
		this.addHand(amount, userID);
		this.removeClan(amount, clanID);
	}
	
	globalLeaderBoard() {
		let hands = (Soup.from(require('../data/economy.json'))).entries;
		
		return Object.fromEntries(hands.sort( (a, b) => { return b[1] - a[1] }));
	}
	
	clanLeaderBoard(guildID) {
		let clans = Soup.from((new Clanner()).in(guildID)).entries;
		
		return Object.fromEntries(clans.sort( (a, b) => { return b[1].funds - a[1].funds }));
	}
	
}

module.exports = { Econner };
