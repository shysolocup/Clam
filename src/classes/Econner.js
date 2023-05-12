const { Clanner } = require('./Clanner.js');
const { Paged } = require('./Paged.js');
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
        hands.set(id, (hands.get(id)+amount) );
        
        hands.dump('./src/data/economy.json', null, 4);
    }


    removeHand(amount, id) {
        let hands = Soup.from(require('../data/economy.json'));
        hands.set(id, (hands.get(id)-amount) );
        
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
	
	
	give(amount, sender, reciever) {
        this.removeHand(amount, sender);
	    this.addHand(amount, reciever);
    }


    goldMult(userID, guildID) {
        let clans = Soup.from((new Clanner()).in(guildID));
        clans = clans.filter( (_, v) => { return v.members.includes(userID) });
        return clans.some( (_, v) => { return v.gold });
    }
	
	
	async userLB(guildID=null, userID=null) {
		var hands = (Soup.from(require('../data/economy.json'))).entries;
        var { psc } = require('../../index.js');

        if (guildID) {
            let guild = await psc.fetchGuild(guildID);
            let members = Soup.from(await guild.members.fetch());

            hands = hands.filter( (v) => { return members.includes(v[0]); });
        }


        var sorted = Soup.from(Object.fromEntries(hands.sort( (a, b) => { return b[1] - a[1] })));


        var fixed = new Soup();
        for (let i = 0; i < sorted.length; i++) {
            try {
                var { pearl, pearlify } = require('../assets');
                let [ id, bal ] = sorted.entries[i];

                let rank = this.rank(sorted.indexOf(id)+1);

                let user = await psc.fetchUser(id);
                let name = Soup.from(user.username);
                if (name.length > 15) {
                    name.scoop( (_, i) => { return i > 15; }); name.set(15, "...");
                }
                name = `[${name.join("")}](https://discord.com/users/${id})`;

                fixed.push( `${ (userID && user.id == userID) ? "**" : "" }${rank}:**  **${name}**  **•**  **${"`"+pearl}${pearlify(bal)+"`"}${ (userID && user.id == userID) ? "**" : "" }` );
            }
            
            catch(e) {}
        }

        var list = new Paged(10, fixed);

        return list.pour();
	}
	
	
	async clanLB(guildID=null, userID=null) {
		let clans = Soup.from((new Clanner()).every()).entries;

        if (guildID) clans = clans.filter( (v) => { return v[1].guild == guildID });

        
        var sorted = Soup.from(Object.fromEntries(clans.sort( (a, b) => { return b[1].funds - a[1].funds })));


        var fixed = new Soup();
        for (let i = 0; i < sorted.length; i++) {
            try {
                var { pearl, pearlify } = require('../assets');
                let [ id, clan ] = sorted.entries[i];
                let rank = this.rank(sorted.indexOf(id)+1);


                let name = Soup.from(clan.name);
                if (name.length > 15) {
                    name.scoop( (_, i) => { return i > 15; });
                    name.set(15, "...");
                }
                name = name.join("");

                fixed.push( `${ (userID && clan.owner == userID) ? "**" : "" }${rank}:**  **${name} (${ "`"+clan.id+"`" })**  **•**  **${"`"+pearl}${pearlify(clan.funds)+"`"}${ (userID && clan.owner == userID) ? "**" : "" }` );
            }

            catch(e) {}
        }

        var list = new Paged(10, fixed);

        return list.pour();
	}

    rank(int) {
        return `${int}${ (() => {
            if (int > 3 && int < 21) return "th";
            switch( int % 10) {
                case 1: return "st"; break;
                case 2: return "nd"; break;
                case 3: return "rd"; break;
                default: return "th"; break;
            }
        })() }`;
    }
	
}

module.exports = { Econner };
