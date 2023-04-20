const { Soup } = require('stews');

class Clanner {
	constructor() {
		var clans = Soup.from(require('../data/clans.json'));

		this.content = clans;

		return new Proxy(this, ClannerProxyHandler());
	}
	

	fetch(id, guildID=null) {
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
	
	
	has(id, guildID=null) {
		var stuff;
		if (guildID) {
			stuff = Soup.from(this[guildID]);
		}
		else {
			stuff = this.values.map( (v) => {
                return Object.keys(v);
            }).flat();
		}
		
		return stuff.includes(id);
	}
	

	count(guilID=null) {
		return (guildID) ? Soup.from(this[guildID]).length : this.values.length;
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
