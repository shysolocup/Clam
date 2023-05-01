const { Shout } = require('./Shout.js');
const { Soup } = require('stews');

class Clanner {
	get all() {
		return Soup.from(require('../data/clans.json'));
	}

	in(guildID) {
		return Soup.from(require('../data/clans.json')[guildID]);
	}

	fetch(id, guildID=null) {
		let clans = Soup.from(require('../data/clans.json'));

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


	set(id, name, value) {
		let clan = this.fetch(id);
		var clans = Soup.from(require('../data/clans.json'));

		clans[clan.guild][id][name] = value;
		clans.dump('./src/data/clans.json', null, 4);
	}


	shout(id, content, author) {
		let shout = new Shout(content, author);
		this.set(id, "shout", shout);
	}


	join(id, userID) {
		let members = Soup.from(this.fetch(id).members);
		let bans = Soup.from(this.fetch(id).bans);

		if (!members.has(userID) && !bans.has(userID)) members.push(userID);

		this.set(id, "members", members.pour() );
	}


	leave(id, userID) {
		let members = Soup.from(this.fetch(id).members);
		let ops = Soup.from(this.fetch(id).ops);
		let owner = this.fetch(id).owner;

		if (userID == owner) return;
		if (members.has(userID)) members.remove(userID);
		if (ops.has(userID)) ops.remove(userID);

		this.set(id, "members", members.pour());
		this.set(id, "ops", ops.pour());
	}


	ban(id, userID) {
		let bans = Soup.from(this.fetch(id).bans);
		let ops = Soup.from(this.fetch(id).ops);
		let owner = this.fetch(id).owner;

		if (ops.has(userID) || owner == userID) return;
		if (!bans.has(userID)) {

			bans.push(userID);
			this.leave(id, userID);

		}

		this.set(id, "bans", bans.pour());
	}


	unban(id, userID) {
		let bans = Soup.from(this.fetch(id).bans);
		if (bans.has(userID)) bans.remove(userID);

		this.set(id, "bans", bans.pour());
	}


	op(id, userID) {
		let members = Soup.from(this.fetch(id).members);
		let ops = Soup.from(this.fetch(id).ops);

		if (!members.has(userID)) return;
		if (!ops.has(userID)) ops.push(userID);

		this.set(id, "ops", ops.pour());
	}


	deop(id, userID) {
		let ops = Soup.from(this.fetch(id).ops);
		if (ops.has(userID)) ops.remove(userID);

		this.set(id, "ops", ops.pour());
	}


	transfer(id, userID) {
		this.set(id, "owner", userID);
	}

	
	has(id, guildID=null) {
		return this.fetch(id, guildID).length > 0;
	}
	

	count(guildID=null) {
		var clans = Soup.from(require('../data/clans.json'));
		let stuff = (guildID) ? Soup.from(clans[guildID]) : clans.values;
		stuff = stuff.map( (v) => {
			return Object.keys(v);
		}).flat();

		return stuff.length;
	}


	status(int) {
		return (int == 1) ? "Public" : (int == 2) ? "Private" : (int == 3) ? "Unlisted" : "Public";
	}


	listify(guildID) {
		var clans = this.in(guildID);
		var list = new Soup({
			pages: 1,
			total: 0,
			fields: new Soup([
				[]
			])
		});

		var page = 0;
		var count = 0;

		for (let i = 0; i < clans.length; i++) {
			let data = clans[i];

			if (data.status != 3) {
				try {
					if (!list.fields[page+1] && count >= 5) { page++; list.pages++; list.fields[page] = []; count = 0; }

					list.fields[page].push({
						name: `• ${data.name} ${ (data.gold) ? emojis.gold : "" } ( id: ${data.id} )`,
						value: `** ** Owned by <@${data.owner}>\n** ** Members: ${data.members.length}\n** ** ${this.status(data.status)}`
					});

					list.total++;
					count++;
				}
				catch(e) {}
			}
		}

		return list;
	}
	
}

module.exports = { Clanner };
