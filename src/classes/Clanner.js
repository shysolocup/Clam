const { Soup } = require('stews');

class Clanner {
	get all() {
		return Soup.from(require('../data/clans.json'));
	}

	fetch(id, guildID=null) {
		var clans = Soup.from(require('../data/clans.json'));

		var stuff;
		if (guildID) {
			let guild = Soup.from(clans.get(guildID));
			guild.forEach( (clanID, clanData) => {
				if (clanID == id) stuff = clanData;
			});
		}
		else {
			clans.forEach( (gID, gD) => {
				Soup.from(gD).forEach( (clanID, clanData) => {
					if (clanID == id) stuff = clanData;
				});
			});
		}
		
		return Soup.from(stuff);
	}
	
	
	has(id, guildID=null) {
		var clans = Soup.from(require('../data/clans.json'));

		var stuff;
		if (guildID) {
			stuff = Soup.from(clans[guildID]);
		}
		else {
			stuff = clans.values.map( (v) => {
                return Object.keys(v);
            }).flat();
		}
		
		return stuff.includes(id);
	}
	

	count(guildID=null) {
		var clans = Soup.from(require('../data/clans.json'));
		return (guildID) ? Soup.from(clans[guildID]).length : clans.values.length;
	}
	
}

module.exports = { Clanner };
