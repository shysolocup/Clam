const { Soup } = require('stews');

class Clanner {
	constructor() {
		var clans = Soup.from(require('../data/clans.json'));

		this.content = clans;

		return new Proxy(this, ClannerProxyHandler());
	}

	fetch(id, guildID) {
		var stuff;
		
		if (guildID) {
			let guild = Soup.from(this.get(guildID));
			guild.forEach( (clanID, clanData) => {
				if (clanID == id) stuff = clanData;
			});
		}
		else {
			this.forEach( (gID, gD) => {
				Soup.from(gD).forEach( (clanID, clanData) => {
					if (clanID == id) stuff = clanData;
				});
			});
		}
		
		return Soup.from(stuff);
	}

	count() {
		return this.values.length;
	}
}

function ClannerProxyHandler() {
	return {
		get(target, prop) {
			if (Object.getOwnPropertyNames(Clanner.prototype).includes(prop)) return target[prop];
			return target.content[prop]
		}
	}
}

module.exports = { Clanner };
