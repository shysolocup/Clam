const { Clanner } = require('./Clanner.js');
const { Soup } = require('stews');

class Econner {
    get all() {
		return Soup.from(require('../data/economy.json'));
	}


    async in(guildID) {
        var hands = (Soup.from(require('../data/economy.json'))).entries;
        let { psc } = require('../../index.js');

        let guild = await psc.fetchGuild(guildID);
        let members = Soup.from(await guild.members.fetch());

        hands = hands.filter( (v) => { return members.includes(v[0]); });
		
		return Object.fromEntries(hands.sort( (a, b) => { return b[1] - a[1] }));
    }


	fetchHand(id) {
        let hands = Soup.from(require('../data/economy.json'));
        return hands.get(id);
	}


    fetchClan(id, guildID=null) {
        let clans = new Clanner();
        return clans.fetch(id, guildID).funds;
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


    addClan(amount, id, guildID) {
        let clans = new Clanner();
        let clan = clans.fetch(id, guildID);
        
        clans.set(id, "funds", clan.funds+amount, guildID);
    }
    
    
    removeClan(amount, id, guildID) {
        let clans = new Clanner();
        let clan = clans.fetch(id, guildID);
        
        clans.set(id, "funds", clan.funds-amount, guildID);
    }
    
    
    setClan(amount, id, guildID) {
        let clans = new Clanner();
        let clan = clans.fetch(id, guildID);
        
        clans.set(id, "funds", amount, guildID);
    }
	
	
	has(id) {
		return Soup.from(require('../data/economy.json')).has(id);
	}


    deposit(amount, userID, clanID, guildID) {
        this.removeHand(amount, userID);
	    this.addClan(amount, clanID, guildID);
    }
	
	
	withdraw(amount, userID, clanID, guildID) {
		this.addHand(amount, userID);
		this.removeClan(amount, clanID, guildID);
	}
	
	
	give(amount, victim, reciever) {
        this.removeHand(amount, victim);
	    this.addHand(amount, reciever);
    }
	
	
	async userLB(guildID=null) {
		var hands = (Soup.from(require('../data/economy.json'))).entries;
        let { psc } = require('../../index.js');

        if (guildID) {
            let guild = await psc.fetchGuild(guildID);
            let members = Soup.from(await guild.members.fetch());

            hands = hands.filter( (v) => { return members.includes(v[0]); });
        }
		
		return Object.fromEntries(hands.sort( (a, b) => { return b[1] - a[1] }));
	}
	
	
	async clanLB(guildID=null) {
		let clans = Soup.from((new Clanner()).every()).entries;

        if (guildID) clans = clans.filter( (v) => { return v[1].guild == guildID });
		
		return Object.fromEntries(clans.sort( (a, b) => { return b[1].funds - a[1].funds }));
	}
	
}

module.exports = { Econner };
