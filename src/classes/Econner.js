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
	
	
	async userLB(guildID=null) {
		var hands = (Soup.from(require('../data/economy.json'))).entries;
        var { psc } = require('../../index.js');

        if (guildID) {
            let guild = await psc.fetchGuild(guildID);
            let members = Soup.from(await guild.members.fetch());

            hands = hands.filter( (v) => { return members.includes(v[0]); });
        }

        var sorted = Soup.from(Object.fromEntries(hands.sort( (a, b) => { return b[1] - a[1] })));

        var list = new Soup({
			pages: 1,
			total: 0,
            raw: sorted,
			content: new Soup([
				[]
			])
		});

        var page = 0;
		var count = 0;

        for (let i = 0; i < sorted.length; i++) {
			var { pearl, pearlify } = require('../assets');
			let [ id, bal ] = sorted.entries[i];
            let rank = this.rank(sorted.indexOf(id)+1);

            let user = await psc.fetchUser(id);
            let name = Soup.from(user.username);
            if (name.length > 15) {
                name.scoop( (_, i) => { return i > 15; });
                name.set(15, "...");
            }
            name = `[${name.join("")}](https://discordapp.com/users/${id})`;

            try {
                if (!list.content.get(page+1) && count >= 5) { page += 1; list.pages += 1; list.content.push( [] ); count = 0; }

                list.content[page].push(
                    `${rank}:**  **${name}**  **•**  **${"`"+pearl}${pearlify(bal)+"`"}`
                );

                list.total += 1;
                count += 1;
            }
            catch(e) {}
		}

        return list.pour();
	}
	
	
	async clanLB(guildID=null, includeUnlisted=false) {
		let clans = Soup.from((new Clanner()).every()).entries;

        if (guildID) clans = clans.filter( (v) => { return v[1].guild == guildID });

        var sorted = Soup.from(Object.fromEntries(clans.sort( (a, b) => { return b[1].funds - a[1].funds })));

        var list = new Soup({
			pages: 1,
			total: 0,
            raw: sorted,
			content: new Soup([
				[]
			])
		});

        var page = 0;
		var count = 0;

        for (let i = 0; i < sorted.length; i++) {
			var { pearl, pearlify } = require('../assets');
			let [ id, clan ] = sorted.entries[i];
            let rank = this.rank(sorted.indexOf(id)+1);


            let name = Soup.from(clan.name);
            if (name.length > 15) {
                name.scoop( (_, i) => { return i > 15; });
                name.set(15, "...");
            }
            name = name.join("");


			if (clan.status != 3 || includeUnlisted) {
				try {
					if (!list.content.get(page+1) && count >= 5) { page += 1; list.pages += 1; list.content.push( [] ); count = 0; }

					list.content[page].push(
                        `${rank}:**  **${name} (${ "`"+clan.id+"`" })**  **•**  **${"`"+pearl}${pearlify(clan.funds)+"`"}`
                    );

					list.total += 1;
					count += 1;
				}
				catch(e) {}
			}
		}

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
