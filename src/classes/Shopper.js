// unfinished

const { Paged } = require('./Paged.js');
const { Soup } = require('stews');

class Shopper {
	get all() {
		return Soup.from(require('../data/shops.json'));
	}

	in(guildID) {
		return Soup.from(require('../data/shops.json')[guildID]);
	}

	fetch(id, guildID=null) {
		let shops = Soup.from(require('../data/shops.json'));

		var stuff;
		if (guildID) {
			let guild = Soup.from(shops.get(guildID));
			guild.forEach( (clanID, items) => {
				if (clanID == id) stuff = items;
			});
		}
		else {
			shops.forEach( (gID, gD) => {
				Soup.from(gD).forEach( (clanID, items) => {
					if (clanID == id) stuff = items;
				});
			});
		}
		
		return Soup.from(stuff);
	}


    fetchItem(itemID, clanID, guildID) {
        return this.fetch(clanID, guildID)[itemID];
    }


	set(itemID, clanID, name, value, guildID) {
		let clan = this.fetch(id, guildID);
		var shops = Soup.from(require('../data/shops.json'));

		shops[clan.guild][clan.id][name] = value;
		clans.dump('./src/data/shops.json', null, 4);
	}

	remove(itemID, userID, guildID) {
		var invs = Soup.from(require('../data/inventories.json'));

		var stuff = Soup.from(invs[guildID][userID]);
		delete stuff[itemID];

		invs[guildID][userID] = stuff.pour();

		invs.dump('./src/data/inventories.json', null, 4);
	}

	give(itemID, sender, receiver, guildID) {
		this.remove(itemID, sender, guildID);
		this.add(itemID, receiver, guildID);
	}

	owns(itemID, userID, guildID) {
		let inv = this.fetch(userID, guildID);
		return inv.includes(itemID);
	}
	
	has(id, guildID=null) {
		return this.fetch(id, guildID).length > 0;
	}
	
	count(guildID=null) {
		var invs = Soup.from(require('../data/inventories.json'));
		let stuff = (guildID) ? Soup.from(invs[guildID]) : invs.values;
		stuff = stuff.map( (v) => {
			return Object.keys(v);
		}).flat();

		return stuff.length;
	}

	list(id, guildID) {
		var inv = this.fetch(id, guildID);
		let list = new Paged(5, inv);
		return list;
	}
}

module.exports = { Invenner };
