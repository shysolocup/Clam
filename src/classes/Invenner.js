const { Paged } = require('./Paged.js');
const { Soup } = require('stews');

class Invenner {
	get all() {
		return Soup.from(require('../data/inventories.json'));
	}

	in(guildID) {
		return Soup.from(require('../data/inventories.json')[guildID]);
	}

	every() {
		let stuff = new Soup(Object);

		let invs = Soup.from(require('../data/inventories.json'));

		invs.forEach( (guildID, guild) => {
			Soup.from(guild).forEach( (k, v) => {
				stuff.push(`${guildID}/${k}`, v);
			});
		});
		
		return stuff;
	}

	fetch(id, guildID=null) {
		let invs = Soup.from(require('../data/inventories.json'));

		var stuff;
		if (guildID) {
			let guild = Soup.from(invs.get(guildID));
			guild.forEach( (userID, items) => {
				if (userID == id) stuff = items;
			});
		}
		else {
			invs.forEach( (gID, gD) => {
				Soup.from(gD).forEach( (userID, items) => {
					if (userID == id) stuff = items;
				});
			});
		}
		
		return Soup.from(stuff);
	}


	set(userID, value, guildID) {
		var invs = Soup.from(require('../data/inventories.json'));

		invs[guildID][userID] = value;
		invs.dump('./src/data/inventories.json', null, 4);
	}


	delete(userID, guildID) {
		var invs = Soup.from(require('../data/inventories.json'));

		delete invs[guildID][userID];
		invs.dump('./src/data/inventories.json', null, 4);
	}

	add(itemID, userID, guildID) {
		var invs = Soup.from(require('../data/inventories.json'));

		invs[guildID][userID].push(itemID);

		invs.dump('./src/data/inventories.json', null, 4);
	}

	remove(itemID, userID, guildID) {
		var invs = Soup.from(require('../data/inventories.json'));

		var stuff = Soup.from(invs[guildID][userID]);
		delete stuff[itemID];

		invs[guildID][userID] = stuff.pour();

		invs.dump('./src/data/inventories.json', null, 4);
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
