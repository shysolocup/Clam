const { Shout } = require('./Shout.js');
const { Soup } = require('stews');

class Clanner {
	get all() {
		return Soup.from(require('../data/clans.json'));
	}

	in(guildID) {
		return Soup.from(require('../data/clans.json')[guildID]);
	}

	every() {
		let stuff = new Soup(Object);

		let clans = Soup.from(require('../data/clans.json'));

		clans.forEach( (guildID, guild) => {
			Soup.from(guild).forEach( (k, v) => {
				stuff.push(`${guildID}/${k}`, v);
			});
		});
		
		return stuff;
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


	set(id, name, value, guildID) {
		let clan = this.fetch(id, guildID);
		var clans = Soup.from(require('../data/clans.json'));

		clans[clan.guild][id][name] = value;
		clans.dump('./src/data/clans.json', null, 4);
	}


	setID(id, value, guildID) {
		let clan = this.fetch(id, guildID);
		var clans = Soup.from(require('../data/clans.json'));

		clans[clan.guild] = Soup.from(clans[clan.guild]);
		clans[clan.guild][id].id = value;
		clans[clan.guild].rename(id, value);
		clans.dump("./src/data/clans.json", null, 4);
	}


	disband(id, guildID) {
		let clan = this.fetch(id, guildID);
		var clans = Soup.from(require('../data/clans.json'));

		delete clans[clan.guild][id];
		clans.dump('./src/data/clans.json', null, 4);
	}


	shout(id, content, author, guildID) {
		let shout = new Shout(content, author);
		this.set(id, "shout", shout, guildID);
	}


	join(id, userID, guildID) {
		let members = Soup.from(this.fetch(id, guildID).members);
		let bans = Soup.from(this.fetch(id, guildID).bans);

		if (!members.has(userID) && !bans.has(userID)) members.push(userID);

		this.set(id, "members", members.pour(), guildID);
	}


	leave(id, userID, guildID) {
		let members = Soup.from(this.fetch(id, guildID).members);
		let ops = Soup.from(this.fetch(id, guildID).ops);
		let owner = this.fetch(id, guildID).owner;

		if (userID == owner) return;
		if (members.has(userID)) members.remove(userID);
		if (ops.has(userID)) ops.remove(userID);

		this.set(id, "members", members.pour(), guildID);
		this.set(id, "ops", ops.pour(), guildID);
	}


	ban(id, userID, guildID) {
		let bans = Soup.from(this.fetch(id, guildID).bans);
		let ops = Soup.from(this.fetch(id, guildID).ops);
		let owner = this.fetch(id, guildID).owner;

		if (ops.has(userID) || owner == userID) return;
		if (!bans.has(userID)) {

			bans.push(userID);
			this.leave(id, userID, guildID);

		}

		this.set(id, "bans", bans.pour(), guildID);
	}


	unban(id, userID, guildID) {
		let bans = Soup.from(this.fetch(id, guildID).bans);
		if (bans.has(userID)) bans.remove(userID);

		this.set(id, "bans", bans.pour(), guildID);
	}


	op(id, userID, guildID) {
		let members = Soup.from(this.fetch(id, guildID).members);
		let ops = Soup.from(this.fetch(id, guildID).ops);

		if (!members.has(userID)) return;
		if (!ops.has(userID)) ops.push(userID);

		this.set(id, "ops", ops.pour(), guildID);
	}


	deop(id, userID, guildiD) {
		let ops = Soup.from(this.fetch(id, guildID).ops);
		if (ops.has(userID)) ops.remove(userID);

		this.set(id, "ops", ops.pour(), guildID);
	}


	transfer(id, userID, guildID) {
		this.set(id, "owner", userID, guildID);
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
		return (int == 1) ? "Public 👥" : (int == 2) ? "Private 🔒" : (int == 3) ? "Unlisted 👻" : "Public 👥";
	}

	intStatus(string) {
		return (string == "public") ? 1 : (string == "private") ? 2 : (string == "unlisted") ? 3 : 1;
	}


	listify(guildID, includeUnlisted=false) {
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
			var { emojis } = require('../assets');
			let data = clans[i];

			if (data.status != 3 || includeUnlisted) {
				try {
					if (!list.fields.get(page+1) && count >= 3) { page += 1; list.pages += 1; list.fields.push( [] ); count = 0; }

					list.fields[page].push({
						name: `• ${data.name} ${ (data.gold) ? emojis.gold : "" } ( id: ${data.id} )`,
						value: `** ** Owned by <@${data.owner}>\n** ** Members: ${ "`"+data.members.length+"`" }\n** ** ${this.status(data.status)}`
					});

					list.total += 1;
					count += 1;
				}
				catch(e) {}
			}
		}

		return list;
	}

	canSet(attr) {
		attr = attr.toLowerCase();
		let settables = require('../../config/settables.json');
		return settables.includes(attr);
	}
	
}

module.exports = { Clanner };
