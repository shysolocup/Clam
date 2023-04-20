const { Client, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder} = require("discord.js");
const fetch = require('node-fetch');
const bot = new Client({
	intents: 33283
});

const fs = require("fs");

var dyn = require("./dyn.json");
var econ = require("./econ.json");
var file = "dyn.json";
var file2 = "econ.json";
var prefix = "!";
var pearl = "🔘";

var config = require("./config.json");

console.log("Started");

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}\n`);
	bot.user.setPresence({
		activities: [{
			name: `over ${dynCount(dyn)} clans`,
			type: ActivityType.Watching
		}]
	});
});

String.prototype.user = function() {
    let mention = this; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = bot.users.cache.get(mention); return (!user) ? null : user;
};

String.prototype.block = function() {
	return "`"+this+"`";
};

function m(funds) {
	return Intl.NumberFormat().format(Math.round(funds*100)/100);
}

function m2(funds) {
	return Math.round(funds*100)/100
}

String.prototype.CMD = function() {
	res = {};
	pos = this.toLowerCase().indexOf(prefix.toLowerCase());
	res["cmd"] = this.toLowerCase().replace(prefix.toLowerCase(), "").split(" ")[pos];
	res["args"] = this.split(" ").remove(pos);
	return res;
};

String.prototype.colorForm = function() {
	if (this.startsWith("#")) { var a = this.replace("#", "0x"); return parseInt(a); } else { return 0x5865F2; }
};

Array.prototype.randomChoice = function() {
	return this[Math.floor(Math.random() * (Number(this.length)))];
};

function randPack() {}

randPack.prototype.randint = function(min, max) {
  return Math.floor(Math.random()*(max-min+1))+min;
};

var random = new randPack();

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

Array.prototype.remove = function(int) {
	const [res, o] = [ [], this];
	const length = o.length;
	for (let i = 0; i < length; i++) {
		if (i < int || i > int) { res.push(this.shift()); }
		if (i == int) { this.shift(); }
	}
	return res;
};

String.prototype.endsWithFor = function(array) {
	for (let i = 0; i < array.length; i++) {
		if (this.endsWith(array[i])) {
			return true
		}
	}
	return false;
};

var infostuffs = {};
var colors = {white:"#FFFFFF",black:'#000000',teal:'#1abc9c',dark_teal:'#11806a',green:'#2ecc71',dark_green:'#1f8b4c',blue:'#3498db',dark_blue:'#206694',purple:'#9b59b6',dark_purple:'#71368a',magenta:'#e91e63',dark_magenta:'#ad1457',gold:'#f1c40f',dark_gold:'#c27c0e',orange:'#e67e22',dark_orange:'#a84300',red:'#e74c3c',dark_red:'#992d22',lighter_grey:'#95a5a6',dark_grey:'#607d8b',light_grey:'#979c9f',darker_grey:'#546e7a',blurple:'#7289da',greyple:'#99aab5',clam:'#FF523A',dynastio:'#852C34',boobie:'#B00B1E',fish:'#EA7E00',water:'#2F99E3',nut:"#FFEC67"}
var responses = ["You worked hard for $!", "You make some art and get $!", "You sell a family treasure and get $!", "You helped bury a body and got payed $ to not tell anyone!", "You did a funny for $!", "You made a script and got $!", "You worked at a fast food resturant and gave a kid diabetes but got $!", "You were a bit goofy and got $ for it!", "You got harassed on twitter and got $ in compensation!", "You sued God for negligence and got $!", "You cooked some burgers and got $!", "You cleaned dishes and got $!", "You bought a table and somehow got $ from it!", "You pulled $ out of an interdimensional rift!", "You did something and got $!", "You told a moderator to shut up and got $ for it!", "Where did my lungs go, also you got $ from something  ᵇᵘᵗ ʳᵉᵃˡˡʸ ʷʰᵉʳᵉ ᵈⁱᵈ ᵗʰᵉʸ ᵍᵒ⁻", "You worked REALLLYY hard and got $ for your efforts!", "You found a rare treasure and sold it for $!", "You found a lamp! Free $!", "Clam personally flew to your house and gave you $!", "You hacked into the government and got $!", "You sold meth with a bald guy in New Mexico and got a $ cut!", "You got such a bad haircut that the barber paid you $!", "You sold a totally not suspicious lung for $!", "You died and got $ in compensation!", "Clam likes you today! Free $!", "Your video blew up and got you $!", "You fixed some code and got $!", "You committed vehicular manslaughter but got $ from it somehow!", "You streamed a game and got $!", "You threw your cat on steam but got donated $ by simps!", "You raised $ for charity! (the charity is your pocket)", "You made an NFT scam and got $ but also ruined peoples' lives! YAY!"];
var responses2 = ["You nabbed @'s purse and got away with $!", "You broke into @'s home and got away with $!", "@ just gave you $ without a struggle!", "You held @ at gunpoint and got away with $!", "You nabbed @'s wallet and got away with $!", "You hit @ with your car took their wallet and ran off with $!", "You robbed @ and got away with $!", "You pulled a goofy and pickpocketed $ off of @!", "You beat @ over the head with a lamp and took $ from them!"];
var responses3 = ["You tried to nab @'s purse and got fined $!", "You broke into @'s home but got shot! Your medical bills were $.", "@ punched you in the face! Your medical bills were $!", "You held @ at gunpoint but tripped and got fined $!", "You tried nabbing @'s wallet but tripped and dropped $!", "You hit @ with your car but couldn't get away fast enough! They made you pay $!", "You robbed @ but had to pay $!", "You tried to pull a goofy but got caught by @! You got fined $.", "Clam doesn't like you today! -$!", "You died trying to rob @ and had to pay $ in medical bills!", "You got bitch slapped by @ and dropped $!", "You tried to get @ with a scam but failed and got fined $!", "While trying to rob @ a lamp stabbed you and cost you $ in medical bills!"];

function balColor(balance) {
	balance = parseInt(`${balance}`.split(",").join(""));
	var col = (balance >= 999999999999999) ? [0xFF523A, 11] :
		(balance >= 10000000000000) ? [0xFFFFFF, 10] :
		(balance >= 1000000000000) ? [0xf1c40f, 9] :
		(balance >= 100000000000) ? [0x95a5a6, 8] :
		(balance >= 10000000000) ? [0xCD7F32, 7] :
		(balance >= 1000000000) ? [0x9b59b6, 6] :
		(balance >= 500000000) ? [0x2F99E3, 5] :
		(balance >= 10000000) ? [0x2ecc71, 4] :
		(balance >= 5000000) ? [0x206694, 3] :
		(balance == 800813) ? [0xB00B1E, 800813] :
		(balance >= 100000) ? [0x1f8b4c, 2] :
		(balance >= 1000) ? [0x11806a, 1] :
		(balance <= -999999999999999) ? [0xFFEC67, 999999999999999] :
		(balance < 0) ? [0x546e7a, 5] :
		(balance < 1000) ? [0x99aab5, 0] : 
		[0x000000, -1];
		
		/*
		(userBal >= 999999999999) ? [0xFF523A, 10] : [0x852C34, 11]
  		*/
	return col;
}

var theTRueEpic = "500714808912642048";
var theEpic = config.theEpic;

var defaultIcon = "https://cdn.discordapp.com/attachments/1037240528338685962/1058755295003807794/logo.png";
var defaultBanner = "https://cdn.discordapp.com/attachments/1037240528338685962/1058754479291387924/banner.png";
var commandList = {
	"General": [
		"`!join <id>  •  Lets a user join a clan (as long as it's public)",
		"!leave <id>  •  Lets a user leave a clan",
		"!invite/inv <user> <id>  •  Sends a user an invite to a clan",
		"!get <id>  •  Sends a page with details of the clan",
		"!list  •  Sends a page with all of the clans in the server",
		"!img/image <id>  •  Sends a clan's thumbnail",
		"!img2/image2 <id>  •  Sends a clan's banner`",
	],
	"Management": [
		"`!create/register  •  Creates a clan",
		"!set/edit <id> <atr> <inp>  •  Changes a part of a clan",
		"!shout <id> <message>  •  Changes the clan shout",
		"!disband <id>  •  Deletes the given clan",
		"!gold <id> <id>  •  Lets a clan owner transfer their gold to another",
		"`\n(SERVER OWNERS ONLY)\n`!export • Lets the owner of the server export all clans into a .JSON file",
		"!import <file>  •  Lets the owner of the server import a .JSON file of clans\n`",
	],
	"Moderation": [
		"`!ban <user> <id>  •  Bans a user from a clan",
		"!unban <user> <id>  •  Unbans a user from a clan",
		"!kick <user> <id>  •  Kicks a user from a clan",
		"!op <user> <id>  •  Gives a user operator permissions\n\n(WARNING: Op has permissions to use the mod commands including !set which could be dangerous.)\n",
		"!deop <user> <id>  •  Removes a user's operator permissions`",
	],
	"Economy": [
		"`!balance/bal <(OPTIONAL) user>  •  Gets a user's balance",
		"!work  •  Lets you work for pearls",
		"!fund/deposit <id> <amount>  •  Lets you put pearls into a clan",
		"!withdraw <id> <amount>  •  Lets clan owners take out pearls",
		"!give <user> <amount>  •  Lets you give others your pearls",
		"!rob/steal <user>  •  Lets you take pearls from other people's balances",
		"!slots <bet>  •  A game of slots that multiplies your bet if you win`"
	],
	"Epic": [
		"`!getglobal <id>  •  Same as !get but clans from other servers",
		"!forcedelete <id>  •  Lets you delete a clan by force",
		"!forceset <id> <atr> <inp>  •  Lets you edit a clan by force",
		"!forceshout <id> <message>  •  Changes a clan's shout by force",
		"!forcejoin <id>  •  Lets you join a clan by force",
		"!dump  •  Dumps the infostuffs table in a .JSON file in your DMs",
		"!export  •  Lets you export all clans in a server into a .JSON file",
		"!import <file>  •  Lets you import a .JSON file of clans into a server\n`"
	]
	
};

const workCooldown = new Set();
const giveCooldown = new Set();
const robCooldown = new Set();
const fundCooldown = new Set();
const withCooldown = new Set();
const slotsCooldown = new Set();
const cooldown = new Set();

bot.on("messageCreate", async (ctx) => {
	try { bot.user.setPresence({activities:[{name:`over ${dynCount(dyn)} clans`,type:ActivityType.Watching}]});
	// if (ctx.author.id == "734819295065800786") { return ctx.reply("arad shut the fuck up"); }
	if (ctx.author.bot || !ctx.content.startsWith(prefix) || ctx.content.endsWith(prefix) && ctx.content.startsWith(prefix)) return;
	if (ctx.author.id != theTRueEpic && config.offline) {
		return ctx.reply({embeds: [{
			color: colors.blurple.colorForm(),
			title: "Oops!  :face_with_spiral_eyes:",
			description: "Clam is currently under maintenance at the moment and will be back shortly."
		}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
	}

	var command = ctx.content.CMD().cmd;
	var args = ctx.content.CMD().args;
		 
	/*  1.3 ECONOMY STUFF  */

	if (command == "balance" || command == "bal") {
		if (!args[0]) {
			return ctx.reply({embeds: [{
				color: balColor((econ[ctx.author.id]) ? m(econ[ctx.author.id]) : 0 )[0],
				title: "Your Balance   :bucket:",
				description: (econ[ctx.author.id] <= -999999999999999) ? "How did you manage this" : (econ[ctx.author.id] < 0) ? "(PS. Enjoy rank 5 poor)" : "",
				fields: [{
					name: "Hand", value: "`" + `${pearl}${ (econ[ctx.author.id]) ? m(Math.round(econ[ctx.author.id])) : 0 }` + "`", inline: true
				}, {
					name: "Rank", value: "`" + balColor((econ[ctx.author.id]) ? m(econ[ctx.author.id]) : 0 )[1] + "`", inline: true
				}],
				footer: {text: ctx.author.tag, icon_url: `https://cdn.discordapp.com/avatars/${ctx.author.id}/${ctx.author.avatar}.png`}
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a valid user."
			}]});
		}

		return ctx.reply({embeds: [{
			color: balColor((econ[user.id]) ? m(econ[user.id]) : 0 )[0],
			title: `${user.username}'s Balance   :bucket:`,
			fields: [{
				name: "Hand", value: "`" + `${pearl}${ (econ[user.id]) ? m(Math.round(econ[user.id])) : 0 }` + "`", inline: true
			}, {
				name: "Rank", value: "`" + balColor((econ[user.id]) ? m(econ[user.id]) : 0 )[1] + "`", inline: true
			}],
			footer: {text: user.tag, icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
		}]});
		
	}

	if (command == "work") {
		if (workCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 seconds before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	workCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		workCooldown.delete(ctx.author.id);
        	}, 10000);
    	}
		
		let userBal = (econ[ctx.author.id]) ? econ[ctx.author.id] : 25;

		let mult = (econ[ctx.author.id]) ? parseInt(`1.${balColor(userBal)[1]}`) : 1.5;
		let amount = Math.abs(Math.round(random.randint(1, mult*userBal) / random.randint(1,5)))+1;

		if (userBal-amount <= -999999999999999) {
			econSet( [ctx.author.id, 0, 0] );
			return ctx.reply({embeds: [{
				color: 0x57F287,
				description: "<:confirm:1052011206891798618>  Here just go back to 0 for fucks sake jeez.",
			}]});
		}
		
		if (userBal+amount >= 999999999999999) {
			econSet( [ctx.author.id, 999999999999999, 0] );
			return ctx.reply({embeds: [{
				color: 0x57F287,
				description: "<:confirm:1052011206891798618>  You have reached the max pearls!",
			}]});
		}
		
		econSet( [ctx.author.id, amount, 1] );

		return ctx.reply({embeds: [{
			color: colors.blurple.colorForm(),
			description: responses.randomChoice().replace("$", "`"+pearl+m(amount)+"`"),
			footer: {text: `(Total: ${pearl+m(econ[ctx.author.id])})`}
		}]});
	}

	if (command == "give") {
		if (giveCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 seconds before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	giveCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		giveCooldown.delete(ctx.author.id);
        	}, 10000);
    	}
		var userBal = econ[ctx.author.id];
		var serverid = ctx.guild.id;
		
		if (!args[0]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user.",
			}]});
		}

		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a valid user."
			}]});
		}

		var otherBal = econ[user.id];

		if (!args[1]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include an amount.",
			}]});
		}
	
		if (args[1] == "all") args[1] = userBal; 
		var amount = parseInt(`${args[1]}`.split(",").join(""));

		if (userBal <= 0 || !econ[ctx.author.id]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You literally have nothing."
			}]});
		}

		if (econ[user]+amount >= 999999999999999) {
			econSet( [user.id, 999999999999999, 0] );
			econSet( [ctx.author.id, 999999999999999-otherBal, 1] );
			if (econ[ctx.author.id] >= 999999999999999) {
				econSet( [ctx.author.id, 999999999999999, 0] );
				return ctx.reply({embeds: [{
					color: 0x57F287,
					description: "<:confirm:1052011206891798618>  You and user have both reached the max pearls!",
				}]});
			} return ctx.reply({embeds: [{
				color: 0x57F287,
				description: "<:confirm:1052011206891798618>  User has reached the max pearls!",
			}]});
		}
		
		econSet( [user.id, amount, 1] );
		econSet( [ctx.author.id, amount, 2] );

		return ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  Gave ${"`"+pearl+m(amount)+"`"} to <@${user.id}>.`
		}]});
	}

	if (command == "steal" || command == "rob") {
		if (robCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 minutes before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	robCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		robCooldown.delete(ctx.author.id);
        	}, 600000);
    	}
		
		var userBal = econ[ctx.author.id];
		var serverid = ctx.guild.id;
		
		if (!args[0]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user.",
			}]});
		}

		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a valid user."
			}]});
		}

		var otherBal = econ[user.id];
		
		var amount = Math.abs(Math.round((random.randint(1, otherBal)/balColor(userBal)[1])));

		if (otherBal <= 0 || !econ[user.id]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> They have literally nothing."
			}]});
		}

		if (random.randint(1, 2) == 2) {
			econSet( [ctx.author.id, amount, 1] );
			econSet( [user.id, amount, 2] );

			if (userBal+amount >= 999999999999999) {
				econSet( [ctx.author.id, 999999999999999, 0] );
				econSet( [user.id, 999999999999999-userBal, 1] );
				return ctx.reply({embeds: [{
					color: 0x57F287,
					description: "<:confirm:1052011206891798618>  You have reached the max pearls!",
				}]});
			}
			
			return ctx.reply({embeds: [{
				color: 0x57F287,
				description: `<:confirm:1052011206891798618> `  + responses2.randomChoice().replace("$", "`"+pearl+m(amount)+"`").replace("@", `<@${user.id}>`),
				footer: {text: `(Total: ${pearl+m(econ[ctx.author.id])})`}
				
			}]});
		}
		else {
			if (userBal-amount <= -999999999999999) {
				econSet( [ctx.author.id, -999999999999999, 0]);
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Do you not get that you're supposed to go up not down?!",
				}]});
			}
			econSet( [ctx.author.id, amount, 2] );
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: `<:decline:1052011672774131762> `  + responses3.randomChoice().replace("$", "`"+pearl+m(amount)+"`").replace("@", `<@${user.id}>`),
				footer: {text: `(Total: ${pearl+m(econ[ctx.author.id])})`}
				
			}]});
		}
	}

	/*
	if (command == "crime") {
		if (robCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 minutes before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	robCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		robCooldown.delete(ctx.author.id);
        	}, 600000);
    	}

		let userBal = (econ[ctx.author.id]) ? econ[ctx.author.id] : 25;

		let mult = (econ[ctx.author.id]) ? parseInt(`1.${balColor(userBal)[1]}`) : 1.5;
		let amount = Math.abs(Math.round(random.randint(1, mult * userBal) / random.randint(1,5)))+ 1 * random.randint(2, 4);

		if (random.randint(1, 3) == 3) {
			econSet( [ctx.author.id, amount, 1] );
			econSet( [user.id, amount, 2] );

			return ctx.reply({embeds: [{
				color: 0x57F287,
				description: `<:confirm:1052011206891798618> `  + responses2.randomChoice().replace("$", "`"+pearl+m(amount)+"`").replace("@", `<@${user.id}>`),
				footer: {text: `(Total: ${pearl+m(econ[ctx.author.id])})`}
				
			}]});
		}
		else {
			if (userBal+amount >= 999999999999999) {
				econSet( [ctx.author.id, 999999999999999, 0]);
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You have reached the max pearls!",
				}]});
			}
			econSet( [ctx.author.id, amount, 2] );
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: `<:decline:1052011672774131762> `  + responses3.randomChoice().replace("$", "`"+pearl+m(amount)+"`").replace("@", `<@${user.id}>`),
				footer: {text: `(Total: ${pearl+m(econ[ctx.author.id])})`}
				
			}]});
		}
	}
 	*/

	if (command == "fund" || command == "deposit" || command == "dep") {
		if (fundCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 seconds before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	fundCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		fundCooldown.delete(ctx.author.id);
        	}, 10000);
    	}
		var userBal = econ[ctx.author.id];
		var serverid = ctx.guild.id;
		if (!args[0]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Funding  :moneybag:",
				description: "<:decline:1052011672774131762> Please include a clan ID to fund.",
			}]});
		}
		if (!dyn[serverid][args[0]]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Funding  :moneybag:",
				description: "<:decline:1052011672774131762> There is not a clan with that ID.",
			}]});
		}
		
		var clan = dyn[serverid][args[0]];
		
		if (!args[1]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Funding  :moneybag:",
				description: "<:decline:1052011672774131762> Please include an amount to give.",
			}]});
		}

		if (args[1] == "all") args[1] = userBal; 
		var amount = parseInt(`${args[1]}`.split(",").join(""));

		if (userBal <= 0 || !econ[ctx.author.id]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Funding  :moneybag:",
				description: "<:decline:1052011672774131762> You literally have nothing."
			}]});
		}

		if (amount > userBal || userBal <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Funding  :moneybag:",
				description: `<:decline:1052011672774131762> You don't have enough cash.  (${"`" + pearl}${m(userBal) + "`"})`,
			}]});
		}

		if (amount <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Funding  :moneybag:",
				description: `<:decline:1052011672774131762> Please give funds greater than 0.`,
			}]});
		}

		if (clan.funds+amount > 999999999999999) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Clan ",
			}]});
		}

		thing2 = parseInt(clan.funds)+parseInt(amount);
		stuff = [args[0], serverid, "funds", thing2];
		dynSet(stuff);

		econSet( [ctx.author.id, parseInt(amount), 2] );

		ctx.reply({embeds: [{
			color: 0x57F287,
			title: "Clan Funding  :moneybag:",
			description: `<:confirm:1052011206891798618>  Deposited ${"`" + pearl + m(amount) + "`"} into ${clan.name}.`,
		}]});
	}

	if (command == "withdraw" || command == "with") {
		if (withCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 seconds before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	withCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		withCooldown.delete(ctx.author.id);
        	}, 10000);
    	}
		var userBal = econ[ctx.author.id];
		var serverid = ctx.guild.id;
		if (!args[0]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Withdraws  :money_with_wings:",
				description: "<:decline:1052011672774131762> Please include a clan ID to withdraw from.",
			}]});
		}
		if (!dyn[serverid][args[0]]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Withdraws  :money_with_wings:",
				description: "<:decline:1052011672774131762> There is not a clan with that ID.",
			}]});
		}
		
		var clan = dyn[serverid][args[0]];
		
		if (!args[1]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Withdraws  :money_with_wings",
				description: "<:decline:1052011672774131762> Please include an amount to take.",
			}]});
		}

		if (args[1] == "all") args[1] = clan.funds; 
		
		var amount = parseInt(`${args[1]}`.split(",").join(""));

		if (clan.funds <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> The clan literally has nothing you can't withdraw nothing."
			}]});
		}

		if (ctx.author.id != clan.ownerid && !theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Withdraws  :money_with_wings:",
				description: "<:decline:1052011672774131762> Only the owner of the clan can withdraw funds."
			}]});
		}

		if (amount > clan.funds || clan.funds <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Withdraws  :money_with_wings:",
				description: `<:decline:1052011672774131762> Clan doesn't have enough funds.  (${"`" + pearl}${m(clan.funds) + "`"})`,
			}]});
		}

		if (amount <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Withdraws  :money_with_wings:",
				description: `<:decline:1052011672774131762> Please give a number greater than 0.`,
			}]});
		}

		if (userBal+amount > 999999999999999) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You cannot hold any more.",
			}]});
		}

		thing2 = parseInt(clan.funds)-parseInt(amount);
		stuff = [args[0], serverid, "funds", thing2];
		dynSet(stuff);

		econSet( [ctx.author.id, parseInt(amount), 1] );

		ctx.reply({embeds: [{
			color: 0x57F287,
			title: "Clan Withdraws  :money_with_wings:",
			description: `<:confirm:1052011206891798618>  Withdrew ${"`" + pearl + m(amount) + "`"} from ${clan.name}.`,
		}]});
	}

	if (command == "slot" || command == "slots") {
		if (slotsCooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Woah there! Wait 10 seconds before you can use this again!"
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	slotsCooldown.add(ctx.author.id);
        	setTimeout(() => {
          		slotsCooldown.delete(ctx.author.id);
        	}, 10000);
    	}
		var slotList = [":fist:", ":v:", ":raised_hand:"];
		if (!args[0]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: " Slot Machine  :slot_machine:",
				description: "<:decline:1052011672774131762> Please include a bet.",
			}]});
		}

		var userBal = econ[ctx.author.id];
		
		if (args[0] == "all") args[0] = userBal; 
		var amount = parseInt(`${args[0]}`.split(",").join(""));

		if (userBal <= 0 || !econ[ctx.author.id]) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Slot Machine  :slot_machine:",
				description: "<:decline:1052011672774131762> You literally have nothing."
			}]});
		}

		if (amount > userBal || userBal <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Slot Machine  :slot_machine:",
				description: `<:decline:1052011672774131762> You don't have enough cash.  (${"`" + pearl}${m(userBal) + "`"})`,
			}]});
		}

		var slots = [];
		for (let i = 0; i < 3; i++) {
			slots.push( slotList.randomChoice() );
		}

		var mult = random.randint(2, 10);
		
		if (slots[0] == slots[1] && slots[1] == slots[2]) {
			if (userBal+amount*mult > 999999999999999) {
				econSet( [ctx.author.id, 999999999999999, 0] );
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot hold any more.",
				}]});
			}
			econSet( [ctx.author.id, parseInt(amount), 2] );
			econSet( [ctx.author.id, parseInt(amount)*mult, 1] );
			return ctx.reply({embeds: [{
				color: 0x57F287,
				title: "Slot Machine  :slot_machine:",
				description: `${slots[0]} | ${slots[1]} | ${slots[2]}`,
				footer: {text: `YOU WIN! Your bet has been multiplied x${mult}! +${pearl}${m(parseInt(amount)*mult)}`}
			}]});
		}
		else {
			econSet( [ctx.author.id, parseInt(amount), 2] );
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Slot Machine  :slot_machine:",
				description: `${slots[0]} | ${slots[1]} | ${slots[2]}`,
				footer: {text: `YOU LOSE! Better luck next time! -${pearl}${m(parseInt(amount))}`}
			}]});
		}
	}

		 

	/*  OTHER STUFF  */


	
	if (command == "help") {
		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
		);
		var row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help5")
					.setEmoji("☠️")
					.setStyle(ButtonStyle.Danger),
		);
		var ret = false;
		try {
			await ctx.author.send({embeds: [{
				color: 0xFF523A,
				title: "•  Clam  •",
				thumbnail: {url: defaultIcon},
				fields: [{
					name: "__General Commands__  👥", value: `${commandList.General.join("\n")}`,
				}, {
					name: "** **", value: "** **", inline: false
				}],
				footer: {text: `${config.versionText} v${config.version}`},
			}],
				components:[ (theEpic.includes(ctx.author.id)) ? row2 : row ]
			});
		} catch(error) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Your DMs are off so I can't send you the help page.",
			}]});
		}

		ctx.reply({embeds: [{
			color: 0x3498DB,
			description: `Check the DM I sent you for the help page!`,
		}]});
	}
	
	if (command == "export") {
		var serverid = ctx.guild.id;
		var owner = await ctx.guild.fetchOwner();
		var clan = dyn[serverid];
		if (ctx.author.id != owner.user.id && !theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Exporting  📤",
				description: "<:decline:1052011672774131762> Only the owner of the server can use this command."
			}]});
		}
		var attachment = new AttachmentBuilder(Buffer.from(`${JSON.stringify(clan, null, 4)}`, 'utf-8'), {name: 'clans.json'});
		try {
			await ctx.author.send({
				content: "Here's your raw clan json. (***WARNING:** Unless you know what you're doing DO NOT change anything!*)",
				files: [attachment]
			});
		} catch(error) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Exporting  📤",
				description: "<:decline:1052011672774131762> Your DMs are off so I can't send you the export.",
			}]});
		}
		ctx.reply({embeds: [{
			color: 0x3498DB,
			title: "Clan Exporting  📤",
			description: `Check the DM I sent you for the export!`,
		}]});
	}
	
	if (command == "import") {
		var serverid = ctx.guild.id;
		var owner = await ctx.guild.fetchOwner();
		if (ctx.author.id != owner.user.id && !theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Importing  📥",
				description: "<:decline:1052011672774131762> Only the owner of the server can use this command."
			}]});
		}
		if (ctx.attachments.size <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Importing  📥",
				description: "<:decline:1052011672774131762> Please include a file to import from."
			}]});
		}
		if (!ctx.attachments.first().url.endsWith(".json")) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Clan Importing  📥",
				description: "<:decline:1052011672774131762> You can only import with a .json file."
			}]});
		}

		let url = ctx.attachments.first().url;
		
		let settings = { method: "Get" };
		
		await fetch(url, settings)
    		.then(res => res.json())
    		.then((thing) => {
        		data = JSON.stringify(dyn, null, 4);
				var parse = JSON.parse(data);
		
				parse[serverid] = thing;

				json = JSON.stringify(parse, null, 4);

				dyn = JSON.parse(json);

				fs.writeFile(file, json, 'utf8', function callback(){});
    	});
		ctx.delete();
		return ctx.channel.send({embeds: [{
			color: 0x57F287,
			title: "Clan Importing  📥",
			description: `<:confirm:1052011206891798618>  <@${ctx.author.id}> Successfully imported all clans from your file into ${ctx.guild}.`
		}]});
	}

	if (command == "dump") {
		if (!theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		var attachment = new AttachmentBuilder(Buffer.from(`${JSON.stringify(infostuffs, null, 4)}`, 'utf-8'), {name: 'infostuffs.json'});
		try {
			await ctx.author.send({
				content: "Here's your infostuffs dump.",
				files: [attachment]
			});
		} catch(error) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Infostuffs Dump  :wastebasket:",
				description: "<:decline:1052011672774131762> Your DMs are off so I can't send you the dump.",
			}]});
		}
		ctx.reply({embeds: [{
			color: 0x3498DB,
			title: "Infostuffs Dump  :wastebasket:",
			description: `Check the DM I sent you for the dump!`,
		}]});
	}

	if (command == "image" || command == "img" || command == "thumbnail") {
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		return ctx.reply({ files: [dyn[serverid][args[0]].img] });
	}

	if (command == "image2" || command == "img2" || command == "banner") {
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		return ctx.reply({ files: [dyn[serverid][args[0]].img2] });
	}

	if (command == "gold") {
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (dyn[serverid][args[1]].flag) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> That clan already has gold."
			}]});
		}

		if (!dyn[serverid][args[0]].flag) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You can't make a clan gold unless you yourself have gold."
			}]});
		}

		if (ctx.author.id != dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Only the clan owner can transfer their gold.",
			}]});
		}
		
		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('goldAccept')
					.setLabel('Yes')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('goldDecline')
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
		);
		
		let a = await ctx.reply({embeds:[{
			color: 0xFFA833,
			title: "Gold Transfer  <:goldenclam:1052759240885940264>",
			description: `Are you sure you would like to transfer your gold to <@${dyn[serverid][args[1]].name}>?`,
			footer: {text: `( id: ${args[0]} )`},
		}],
			components:[row]
		});
		
		infostuffs[a.id] = [dyn[serverid][args[1]].ownerid, args[0], args[1]];
		setTimeout(() => delete infostuffs[a.id], 21600000);
	}
	
	if (command == "transfer") {
		// transfer user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}

		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (user.id == dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> That user is already the owner of the clan."
			}]});
		}

		if (ctx.author.id != dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to op members.",
			}]});
		}
		
		if (!dyn[serverid][args[1]].members.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Member is not in clan.",
			}]});
		}
		
		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('transferAccept')
					.setLabel('Yes')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('transferDecline')
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
		);
		
		let a = await ctx.reply({embeds:[{
			color: 0x3498DB,
			title: "Owner Transfer :crown:",
			description: `Are you sure you would like to transfer ownership to <@${user.id}>?`,
			footer: {text: `( id: ${args[1]} )`},
		}],
			components:[row]
		});
			
		infostuffs[a.id] = [user.id, user.tag, dyn[serverid][args[1]].ownerid, args[1]];
		setTimeout(() => delete infostuffs[a.id], 21600000);
	}

	if (command == "op") {
		// op user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}

		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (dyn[serverid][args[1]].ops.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> That user is already an operator."
			}]});
		}

		if (user.id == dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> That user is already the owner of the clan."
			}]});
		}

		if (ctx.author.id != dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to op members.",
			}]});
		}

		if (!dyn[serverid][args[1]].members.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Member is not in clan.",
			}]});
		}

		thing2 = dyn[serverid][args[1]].ops;
		thing2.push(user.id);
		
		stuff = [args[1], serverid, "ops", thing2];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  Gave ${user} operator permissions.`,
		}]});
	}

	if (command == "deop") {
		// deop user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}

		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (!dyn[serverid][args[1]].ops.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> That user is already not an operator."
			}]});
		}

		try {
			if (user.id == dyn[serverid][args[1]].ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot overthrow the owner of the clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot overthrow the owner of the clan."
				}]});
			}

		if (ctx.author.id != dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to op members.",
			}]});
		}
		
		if (!dyn[serverid][args[1]].members.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Member is not in clan.",
			}]});
		}

		pos = dyn[serverid][args[1]].ops.indexOf(user.id)
		console.log(pos);
		thing2 = dyn[serverid][args[1]].ops;
		thing2 = thing2.remove(pos);
		
		stuff = [args[1], serverid, "ops", thing2 ];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  Removed ${user}'s operator permissions.`,
		}]});
	}

	if (command == "leave") {
		var serverid = ctx.guild.id;
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (!dyn[serverid][args[0]].members.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You are not in this clan."
			}]});
		}

		try {
		if (ctx.author.id == dyn[serverid][args[0]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Clan owners cannot leave their own clan."
			}]});
		}} catch(err) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Clan owners cannot leave their own clan."
			}]});
		}

		pos = dyn[serverid][args[0]].members.indexOf(ctx.author.id)
		console.log(pos);
		thing2 = dyn[serverid][args[0]].members;
		thing2 = thing2.remove(pos);
		
		stuff = [args[0], serverid, "members", thing2 ];
		
		dynSet(stuff);

		if (dyn[serverid][args[0]].ops.includes(ctx.author.id)) {
			pos = dyn[serverid][args[0]].ops.indexOf(ctx.author.id)
			console.log(pos);
			thing2 = dyn[serverid][args[0]].ops;
			thing2 = thing2.remove(pos);
		
			stuff = [args[0], serverid, "ops", thing2 ];
		
			dynSet(stuff);
		}

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  You have left ${dyn[serverid][args[0]].name}.`,
		}]});
	}
	if (command == "join") {
		var serverid = ctx.guild.id;
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (dyn[serverid][args[0]].members.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You are already in this clan."
			}]});
		}
		if (dyn[serverid][args[0]].status.toLowerCase() == "private") {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> That clan is private so you have to have an invite to join."
			}]});
		}
		if (dyn[serverid][args[0]].banned.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You are banned from this clan."
			}]});
		}

		thing2 = dyn[serverid][args[0]].members;
		thing2.push(ctx.author.id);
		console.log(thing2);
		
		stuff = [args[0], serverid, "members", thing2 ];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  You have joined ${dyn[serverid][args[0]].name}.`,
		}]});
	}

	if (command == "kick") {
		// kick user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}

		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		try {
			if (user.id == dyn[serverid][args[1]].ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot overthrow the owner of the clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot overthrow the owner of the clan."
				}]});
			}
		try {
			if (dyn[serverid][args[1]].ops.includes(user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot kick operators."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot kick operators."
				}]});
			}
		

		if (ctx.author.id != dyn[serverid][args[1]].ownerid && !dyn[serverid][args[1]].ops.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to kick members.",
			}]});
		}

		if (!dyn[serverid][args[1]].members.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Member is not in clan.",
			}]});
		}

		pos = dyn[serverid][args[1]].members.indexOf(user.id)
		console.log(pos);
		thing2 = dyn[serverid][args[1]].members;
		thing2 = thing2.remove(pos);
		
		stuff = [args[1], serverid, "members", thing2 ];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  Kicked ${user} from ${dyn[serverid][args[1]].name}.`,
		}]});
	}

	if (command == "ban") {
		// ban user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}


		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		try {
		if (user.id == dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You cannot overthrow the owner of the clan."
			}]});
		}} catch(err) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You cannot overthrow the owner of the clan."
			}]});
		}

		try {
			if (dyn[serverid][args[1]].ops.includes(user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot ban operators."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You cannot ban operators."
				}]});
			}

		try {
			if (dyn[serverid][args[1]].banned.includes(user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> User is already banned."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> User is already banned."
				}]});
			}

		if (ctx.author.id != dyn[serverid][args[1]].ownerid && !dyn[serverid][args[1]].ops.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to ban members.",
			}]});
		}
		thing2 = dyn[serverid][args[1]].banned;
		thing2.push(user.id);
		
		stuff = [args[1], serverid, "banned", thing2];
		
		dynSet(stuff);

		pos = dyn[serverid][args[1]].members.indexOf(user.id)
		console.log(pos);
		thing2 = dyn[serverid][args[1]].members;
		thing2 = thing2.remove(pos);
		
		stuff = [args[1], serverid, "members", thing2 ];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  Banned ${user} from ${dyn[serverid][args[1]].name}.`,
		}]});
	}

	if (command == "unban") {
		// unban user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}


		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		try {
		if (user.id == dyn[serverid][args[1]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> The owner of the clan shouldn't be banned anyway."
			}]});
		}} catch(err) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> The owner of the clan shouldn't be banned anyway."
			}]});
		}

		try {
			if (!dyn[serverid][args[1]].banned.includes(user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> User isn't banned."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> User isn't banned."
				}]});
			}

		if (ctx.author.id != dyn[serverid][args[1]].ownerid && !dyn[serverid][args[1]].ops.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to unban members.",
			}]});
		}

		pos = dyn[serverid][args[1]].banned.indexOf(user.id)
		console.log(pos);
		thing2 = dyn[serverid][args[1]].banned;
		thing2 = thing2.remove(pos);
		
		stuff = [args[1], serverid, "banned", thing2 ];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  Unbanned ${user} from ${dyn[serverid][args[1]].name}.`,
		}]});
	}

	if (command == "shout") {
		var serverid = ctx.guild.id;
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (ctx.author.id != dyn[serverid][args[0]].ownerid && !dyn[serverid][args[0]].ops.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to make shouts in this clan.",
			}]});
		}
		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please put what you want to change the shout to."
			}]});
		}

		for (var i = 1, setArgs = []; i < args.length; i++) {
			setArgs.push(args[i]);
		}

		var thing2 = setArgs.join(" ");
		var thing3 = ctx.author.id;

		stuff = [args[0], serverid, "shout", thing2 ];
		
		dynSet(stuff);

		stuff2 = [args[0], serverid, "shoutUser", thing3]

		dynSet(stuff2);

		return ctx.reply({embeds: [{
			color: 0x57F287,
			title: `Clan Shout  :mega:`,
			description: `<:confirm:1052011206891798618>  Changed ${dyn[serverid][args[0]].name}'s shout to "${thing2}"`,
			footer: {text: `( id: ${args[0]} )`}
		}]});
	}

	if (command == "set" || command == "edit") {
		var setList = ["name", "title", "desc", "description", "img", "image", "thumbnail", "cover", "img2", "image2", "banner", "color", "status"];
		var serverid = ctx.guild.id;
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (args[1] == null || args[2] == null && ctx.attachments.size <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please use the correct arguments for the !set command."
			}]});
		}
		var type;
		if (args[1] == "name" || args[1] == "title") { type = "name"; }
		else if (args[1] == "desc" || args[1] == "description") { type = "desc"; }
		else if (args[1] == "img" || args[1] == "image" || args[1] == "thumbnail" || args[1] == "cover") { type = "img"; }
		else if (args[1] == "img2" || args[1] == "image2" || args[1] == "banner") { type = "img2"; }
		else if (args[1] == "color") { type = "color"; }
		else if (args[1] == "status") { type = "status"; }
		else {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You can't do that  :angry:."
			}]});
		}

		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (type == "color" && colors[args[2]] != null) { args[2] = colors[args[2]]; }

		if (ctx.author.id != dyn[serverid][args[0]].ownerid && !dyn[serverid][args[0]].ops.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to edit this clan.",
			}]});
		}
		
		if (type == "status" && args[2].toLowerCase() != "public" && args[2].toLowerCase() != "private") {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Status can only be public or private."
			}]});
		}
		if (type == "color" && args[2] == "rank") {}
		else if (type == "color" && !args[2].startsWith("#")) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Color can only be a hex code like `#5865F2`."
			}]});
		}

		if ((type == "img" || type == "img2") && ctx.attachments.size > 0) {
			args[2] = ctx.attachments.first().url;
		}
		else if ((type == "img" || type == "img2") && (!args[2].toLowerCase().startsWith("https://") || !args[2].toLowerCase().endsWithFor( ["png","jpeg","jpg","gif" ] ) )) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> If you're not going to attach an image you can only use image links."
			}]});
		}
		
		for (var i = 2, setArgs = []; i < args.length; i++) {
			setArgs.push(args[i]);
		}

		var thing2 = (type == "status") ? setArgs.join(" ").toLowerCase() : setArgs.join(" ");
		stuff = [args[0], serverid, type, thing2 ];
		
		dynSet(stuff);

		if (type == "img" || type == "img2") {
			var embed = {
				color: 0x57F287,
				title: `Clan Editing  :tools:`,
				description: `<:confirm:1052011206891798618>  Set ${type} to`,
				image: {url: thing2},
				footer: {text: `( id: ${args[0]} )`}
			}
		}
		else {
			var embed = {
				color: 0x57F287,
				title: `Clan Editing  :tools:`,
				description: `<:confirm:1052011206891798618>  Set ${type} to `+"`"+thing2+"`.",
				footer: {text: `( id: ${args[0]} )`}
			}
		}

		ctx.reply({embeds: [embed]});
	}

	if (command == "get") {
		var serverid = ctx.guild.id;
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		var clan = dyn[serverid][args[0]];
		var image = clan.img; while (image.includes(" ")) { image = image.replace(" ", "_"); } image = { url: image };
		var image2 = clan.img2; while (image2.includes(" ")) { image2 = image2.replace(" ", "_"); } image2 = { url: image2 };
		var status = clan.status.split(""); status[0] = status[0].toUpperCase(); status = status.join("");
		var opOutput = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
		var memOutput = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;

		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('clanHome')
					.setEmoji("🏡")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('clanStats')
					.setEmoji("📊")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('clanEconomy')
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
		);
		const getEmbed = {
			color: (clan.color == "rank") ? balColor(clan.funds)[0] : clan.color.colorForm(),
			thumbnail: image,
			image: image2,
			title: (clan.flag) ? `${clan.name}  <:goldenclam:1052759240885940264>` : clan.name,
			description: `${clan.desc}\n\n`,
			fields: [
				{ name:"** **\nShout:", value: `"${clan.shout}" - <@${clan.shoutUser}>` , inline: false},
				{ name:"** **", value: "** **", inline: false},
				{ name:"Owner", value: `<@${clan.ownerid}>`, inline: true},
				{ name:"** **", value: "** **", inline: true},
				{ name:"Operators", value: `${opOutput}`, inline: true},
				{ name:"** **", value: "** **", inline: false},
				/*{ name:"** **", value: "** **", inline: false},
				{ name:"Members", value: `${memOutput}`, inline: true},
				{ name:"Member Count", value: `${clan.members.length}`, inline: true},
				{ name:"** **", value: "** **", inline: false}, */
				/*{ name:"** **", value: "** **", inline: false},
				{ name:"Funds", value: "`"+pearl+m(clan.funds)+"`", inline: true},
				{ name:"Rank", value: "`"+balColor(clan.funds)[1]+"`", inline: true},
				{ name:"** **", value: "** **", inline: false}, */
			],
			footer: {text: (ctx.guild.id == serverid) ? `( id: ${args[0]} )` : `( guild id: ${serverid} )\n( clan id: ${args[0]} )`},
			author: {name: `• ${status} •`}
		}
		// "`" + `Funds:  ${"🔘" + m(clan.funds)}  |  Rank:    ${balColor(clan.funds)[1]+"`"}
		
		let a = await ctx.reply({embeds:[getEmbed], components: [row]});
		infostuffs[a.id] = [ctx.guild.id, ctx.author.id, clan.id]
		setTimeout(() => delete infostuffs[a.id], 21600000);
	}

	if (command == "list" || command == "view") {
		var serverid = ctx.guild.id;
		var page = 0;

		var row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary),
		);

		var row2 = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
				new ButtonBuilder()
					.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
				new ButtonBuilder()
					.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
				new ButtonBuilder()
					.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
		);

		if (dyn[serverid] == null || clanList(serverid).pageTotal == null) {
			return ctx.reply({embeds:[{
				color: 0xFF523A,
				title: `Clans in ${ctx.guild.name}`,
				thumbnail: {url: `${ctx.guild.iconURL()}`},
				footer: {text: `Page ${page+1}/1`},
				fields: [
					{name:"• None", value:"** ** Use !create to start up your own clan!"}
				]}],
					components: [row2]
			});
		}
		var fields = clanList(serverid)[page];

		if (clanList(serverid).clanTotal == 1) var desc = `There is ${clanList(serverid).clanTotal} clan in this server`;
		else var desc = `There are ${clanList(serverid).clanTotal} clans in this server`;

		let a = await ctx.reply({embeds:[{
			color: 0xFF523A,
			title: `Clans in ${ctx.guild.name}`,
			description: desc,
			thumbnail: {url: `${ctx.guild.iconURL()}`},
			fields: fields,
			footer: {text: `Page ${page+1}/${clanList(serverid).pageTotal}`}
		}],
			components: [row]
		});
		
		infostuffs[a.id] = [ page, ctx.author.id ];
		setTimeout(() => delete infostuffs[a.id], 21600000);
	}

	if (command == "invite" || command == "inv") {
		if (cooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Woah there!  :face_with_spiral_eyes:",
				description: "<:decline:1052011672774131762> You've been timed out from using clan commands for a minute."
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 1000)
			});
    	} else {
        	cooldown.add(ctx.author.id);
        	setTimeout(() => {
          		cooldown.delete(ctx.author.id);
        	}, 300000);
    	}
		// invite user clan
		var serverid = ctx.guild.id;

		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}

		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[1]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		try {
			if (user.id == dyn[serverid][args[1]].ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Pretty sure the owner of the clan is already in the clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Pretty sure the owner of the clan is already in the clan."
				}]});
			}
		try {
			if (dyn[serverid][args[1]].ops.includes(user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Pretty sure the operators of the clan are already in the clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Pretty sure the operators of the clan are already in the clan."
				}]});
			}
		

		if (dyn[serverid][args[1]].members.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Member is already in clan.",
			}]});
		}
		if (dyn[serverid][args[1]].banned.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Member is banned from the clan."
			}]});
		}
		
		if (!dyn[serverid][args[1]].members.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You have to be in the clan to invite people.",
			}]});
		}
		
		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('inviteAccept')
					.setLabel('Accept')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('inviteDecline')
					.setLabel('Decline')
					.setStyle(ButtonStyle.Danger),
		);

		let a = await ctx.reply({embeds:[{
			color: 0x3498DB,
			title: "Invite  :tada:",
			description: `Hey <@${user.id}>! You were invited to join ${dyn[serverid][args[1]].name} by <@${ctx.author.id}>!`,
			footer: {text: `( id: ${args[1]} )`},
		}],
			components:[row]
		});
		
		infostuffs[a.id] = [user.id, args[1]];
		setTimeout(() => delete infostuffs[a.id], 21600000);
	}

	if (command == "create" || command == "register" || command == "reg") {
		if (cooldown.has(ctx.author.id)) {
        	return ctx.reply({embeds: [{
				color: 0xED4245,
				title: "Woah there!  :face_with_spiral_eyes:",
				description: "<:decline:1052011672774131762> You've been timed out from using clan commands for a minute."
			}]}).then(ctx => {
				setTimeout(() => ctx.delete(), 3000)
			});
    	} else {
        	cooldown.add(ctx.author.id);
        	setTimeout(() => {
          		cooldown.delete(ctx.author.id);
        	}, 60000);
    	}
		var id = [];
		chars = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
		for (let i = 0; i < 4; i++) {
			id.push(chars.randomChoice());
		}

		var nick = ctx.member.displayName.replaceAt(0, ctx.member.displayName[0].toUpperCase());

		var name = `${nick}'s Clan`;
		var desc = "Welcome to your brand new clan!\nUse !set to change parts of the clan to your liking.";
		var img = defaultIcon;
		var img2 = defaultBanner;
		var color = "rank";
		var id = id.join("");

		var owner = ctx.author.tag;
		var ownerid = ctx.author.id;

		var serverid = ctx.guild.id;

		stuff = [name, desc, img, img2, color, id, serverid, owner, ownerid];
		dynCreate(stuff);
		
		const embed = {
			color: 0x57F287,
			title: "Clan Creation :sparkles:",
			description: (dyn[serverid][id].flag) ? `<:confirm:1052011206891798618>  Created your new clan! (<:goldenclam:1052759240885940264>)` : `<:confirm:1052011206891798618>  Created your new clan!`,
			footer: {text: `( id: ${id} )`}
		};

		ctx.reply({embeds:[embed]});
	}

	if (command == "disband") {
		var serverid = ctx.guild.id;
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		var name = dyn[serverid][args[0]].name;
		
		if (ctx.author.id != dyn[serverid][args[0]].ownerid) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Missing permissions to disband this clan.",
			}]});
		}
		
		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('disbandAccept')
					.setLabel('Yes')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('disbandDecline')
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
		);
		
		let a = await ctx.reply({embeds:[{
			color: 0x3498DB,
			title: "Clan Disbanding :wastebasket:",
			description: `Are you sure you would like to disband ${dyn[serverid][args[0]].name}?`,
			footer: {text: `( id: ${args[0]} )`},
		}],
			components:[row]
		});
		
		infostuffs[a.id] = [args[0], name];
		setTimeout(() => delete infostuffs[a.id], 21600000);
	}




	// EPIC COMMANDS ARE HERE



	
		
	if (command == "forcedelete") {
		var serverid = ctx.guild.id;
		if (!theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		var name = dyn[serverid][args[0]].name;
		
		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('fdAccept')
					.setLabel('Yes')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('fdDecline')
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
		);
		
		let a = await ctx.reply({embeds:[{
			color: 0x3498DB,
			title: "Clan Force Deletion :skull_crossbones:",
			description: `Are you sure you would like to force delete ${dyn[serverid][args[0]].name}?`,
			footer: {text: `( id: ${args[0]} )`},
		}],
			components:[row]
		});
	
		infostuffs[a.id] = [args[0], name];
	}

	if (command == "forceset" || command == "forceedit") {
		var setList = ["name", "title", "desc", "description", "img", "image", "thumbnail", "cover", "img2", "image2", "banner", "color", "status"];
		var serverid = ctx.guild.id;
		
		if (!theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (args[1] == null || args[2] == null && ctx.attachments.size <= 0) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please use the correct arguments for the !set command."
			}]});
		}
		var type;
		if (args[1] == "name" || args[1] == "title") { type = "name"; }
		else if (args[1] == "desc" || args[1] == "description") { type = "desc"; }
		else if (args[1] == "img" || args[1] == "image" || args[1] == "thumbnail" || args[1] == "cover") { type = "img"; }
		else if (args[1] == "img2" || args[1] == "image2" || args[1] == "banner") { type = "img2"; }
		else if (args[1] == "color") { type = "color"; }
		else if (args[1] == "status") { type = "status"; }
		else {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You can't do that  :angry:."
			}]});
		}

		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		if (type == "color" && colors[args[2]] != null) { args[2] = colors[args[2]]; }
		
		if (type == "status" && args[2].toLowerCase() != "public" && args[2].toLowerCase() != "private") {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Status can only be public or private."
			}]});
		}

		if (type == "color" && args[2] == "rank") {}
		else if (type == "color" && !args[2].startsWith("#")) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Color can only be a hex code like `#5865F2`."
			}]});
		}

		if ((type == "img" || type == "img2") && ctx.attachments.size > 0) {
			args[2] = ctx.attachments.first().url;
		}
		else if ((type == "img" || type == "img2") && (!args[2].toLowerCase().startsWith("https://") || !args[2].toLowerCase().endsWithFor( ["png","jpeg","jpg","gif" ] ) )) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> If you're not going to attach an image you can only use image links."
			}]});
		}
		
		for (var i = 2, setArgs = []; i < args.length; i++) {
			setArgs.push(args[i]);
		}

		var thing2 = (type == "status") ? setArgs.join(" ").toLowerCase() : setArgs.join(" ");
		stuff = [args[0], serverid, type, thing2 ];
		
		dynSet(stuff);

		if (type == "img" || type == "img2") {
			var embed = {
				color: 0x57F287,
				title: `Clan Force Editing  :sponge:`,
				description: `<:confirm:1052011206891798618>  Set ${type} to`,
				image: {url: thing2},
				footer: {text: `( id: ${args[0]} )`}
			}
		}
		else {
			var embed = {
				color: 0x57F287,
				title: `Clan Force Editing  :sponge:`,
				description: `<:confirm:1052011206891798618>  Set ${type} to `+"`"+thing2+"`.",
				footer: {text: `( id: ${args[0]} )`}
			}
		}

		ctx.reply({embeds: [embed]});
	}
	
	if (command == "forceshout") {
		var serverid = ctx.guild.id;
		
		if (!theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (args[1] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please put what you want to change the shout to."
			}]});
		}

		for (var i = 1, setArgs = []; i < args.length; i++) {
			setArgs.push(args[i]);
		}

		var thing2 = setArgs.join(" ");
		var thing3 = ctx.author.id;

		stuff = [args[0], serverid, "shout", thing2 ];
		
		dynSet(stuff);

		stuff2 = [args[0], serverid, "shoutUser", thing3]

		dynSet(stuff2);

		return ctx.reply({embeds: [{
			color: 0x57F287,
			title: `Clan Force Shout  :sponge:`,
			description: `<:confirm:1052011206891798618>  Changed ${dyn[serverid][args[0]].name}'s shout to "${thing2}"`,
			footer: {text: `( id: ${args[0]} )`}
		}]});
	}
	
	if (command == "forcejoin") {
		var serverid = ctx.guild.id;
		
		if (!theEpic.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}
		if (dyn[serverid][args[0]] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}
		if (dyn[serverid][args[0]].members.includes(ctx.author.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You are already in this clan."
			}]});
		}

		thing2 = dyn[serverid][args[0]].members;
		thing2.push(ctx.author.id);
		console.log(thing2);
		
		stuff = [args[0], serverid, "members", thing2 ];
		
		dynSet(stuff);

		ctx.reply({embeds: [{
			color: 0x57F287,
			description: `<:confirm:1052011206891798618>  You have joined ${dyn[serverid][args[0]].name} by force.`,
		}]});
	}
	if (command == "getglobal") {
		if (ctx.author.id != theTRueEpic) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a clan ID."
			}]});
		}

		var clan = getGlobal(args[0]);
		var serverid = clan.serverid;

		if (clan == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> There is no clan with that ID."
			}]});
		}

		var image = clan.img; while (image.includes(" ")) { image = image.replace(" ", "_"); } image = { url: image };
		var image2 = clan.img2; while (image2.includes(" ")) { image2 = image2.replace(" ", "_"); } image2 = { url: image2 };
		var status = clan.status.split(""); status[0] = status[0].toUpperCase(); status = status.join("");
		var opOutput = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
		var memOutput = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;

		var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('clanHome')
					.setEmoji("🏡")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('clanStats')
					.setEmoji("📊")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('clanEconomy')
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
		);
		const getEmbed = {
			color: (clan.color == "rank") ? balColor(clan.funds)[0] : clan.color.colorForm(),
			thumbnail: image,
			image: image2,
			title: (clan.flag) ? `${clan.name}  <:goldenclam:1052759240885940264>` : clan.name,
			description: `${clan.desc}\n\n`,
			fields: [
				{ name:"** **\nShout:", value: `"${clan.shout}" - <@${clan.shoutUser}>` , inline: false},
				{ name:"** **", value: "** **", inline: false},
				{ name:"Owner", value: `<@${clan.ownerid}>`, inline: true},
				{ name:"** **", value: "** **", inline: true},
				{ name:"Operators", value: `${opOutput}`, inline: true},
				{ name:"** **", value: "** **", inline: false},
				/*{ name:"** **", value: "** **", inline: false},
				{ name:"Members", value: `${memOutput}`, inline: true},
				{ name:"Member Count", value: `${clan.members.length}`, inline: true},
				{ name:"** **", value: "** **", inline: false}, */
				/*{ name:"** **", value: "** **", inline: false},
				{ name:"Funds", value: "`"+pearl+m(clan.funds)+"`", inline: true},
				{ name:"Rank", value: "`"+balColor(clan.funds)[1]+"`", inline: true},
				{ name:"** **", value: "** **", inline: false}, */
			],
			footer: {text: (ctx.guild.id == serverid) ? `( id: ${args[0]} )` : `( guild id: ${serverid} )\n( clan id: ${args[0]} )`},
			author: {name: `• ${status} •`}
		}
		// "`" + `Funds:  ${"🔘" + m(clan.funds)}  |  Rank:    ${balColor(clan.funds)[1]+"`"}
		
		let a = await ctx.reply({embeds:[getEmbed], components: [row]});
		infostuffs[a.id] = [clan.serverid, ctx.author.id, clan.id];
	}
	if (command == "epic") {
		if (ctx.author.id != theTRueEpic) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> You're not supposed to use that. :shushing_face: ",
			}]});
		}
		if (args[0] == null) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please input a valid user."
			}]});
		}
		
		var user = args[0].user();
		
		if (!user) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> Please include a user."
			}]});
		}

		if (theEpic.includes(user.id)) {
			return ctx.reply({embeds: [{
				color: 0xED4245,
				description: "<:decline:1052011672774131762> User is already an epig."
			}]});
		}
		
		theEpic.push(user.id);
		
		data = JSON.stringify(config, null, 4);
		var parse = JSON.parse(data);

		parse["theEpic"] = theEpic;

		json = JSON.stringify(parse, null, 4);

		config = JSON.parse(json);

		fs.writeFile("config.json", json, 'utf8', function callback(){});

		return ctx.reply({embeds: [{
			color: 0x57F287,
			title: ":sponge:",
			thumbnail: {url: "https://cdn.discordapp.com/attachments/1037240528338685962/1056151942931431464/sponge.png"},
			description: `<:confirm:1052011206891798618>  <@${user.id}> is now an epig! :sponge:`,
			footer: {text: ":sponge:", icon_url: "https://cdn.discordapp.com/attachments/1037240528338685962/1056151942931431464/sponge.png"}
		}]});
	}
	
	} catch(error) {
		console.log(`\n${error} // ${ctx.guild}`);
		return ctx.reply({embeds: [{
			color: 0xED4245,
			title: "Oops!  :nerd:",
			description: "An unexpected error has occurred."
		}],
			ephemeral: true		 
		});
	}
});

bot.on('interactionCreate', async (ctx) => {
	try {bot.user.setPresence({activities:[{name:`over ${dynCount(dyn)} clans`,type:ActivityType.Watching}]});
	/*
	if (ctx.isButton()) {
		var command = ctx.commandName;
		if (command == "help") {
			var helpFields = [];
			helpFields.push(
				{
					name: "General Commands", value: `${commandList.General.join("\n")}`
				},
				{
					name: "Clan Management", value: `${commandList.Management.join("\n")}`
				},
				{
					name: "Clan Moderation", value: `${commandList.Moderation.join("\n")}`
				}
	
			);
			
			ctx.reply({embeds: [{
				color: 0xFF523A,
				title: "Clam Help",
				description: "politics go brrrr",
				thumbnail: {url: defaultIcon},
				fields: helpFields,
			}]});
		}
		if (command == "create") {
			var id = [];
			chars = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
			for (let i = 0; i < 4; i++) {
				id.push(chars.randomChoice());
			}
	
			var name = `${ctx.user.username}'s clan`;
			var desc = "Welcome to your brand new clan! Use !set to change parts of the clan to your liking.";
			var img = defaultIcon;
			var color = 0xFF523A;
			var id = id.join("");
	
			var owner = ctx.user.tag;
			var ownerid = ctx.user.id;
	
			var serverid = ctx.guild.id;
	
			stuff = [name, desc, img, color, id, serverid, owner, ownerid];
			console.log(stuff);
			dynCreate(stuff);
			
			const embed = {
				color: 0x57F287,
				title: "Clan Creation :sparkles:",
				description: `<:confirm:1052011206891798618>  Created your new clan!`,
				footer: {text: `( id: ${id} )`}
			};
	
			ctx.reply({embeds:[embed]});
		}
		if (command == "get") {
			args = [];
			args[0] = ctx.options.data[0].value;

			var serverid = ctx.guild.id;
			if (args[0] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please input a clan ID."
				}]});
			}
			try {
			if (dyn[serverid][args[0]] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that ID."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that ID."
				}]});
			}
			var image = dyn[serverid][args[0]].img;
			while (image.includes(" ")) { image = image.replace(" ", "_"); }
			image = { url: image };
	
			var image2 = dyn[serverid][args[0]].img2;
			while (image2.includes(" ")) { image2 = image2.replace(" ", "_"); }
			image2 = { url: image2 };
	
			var status = dyn[serverid][args[0]].status.split("");
			status[0] = status[0].toUpperCase();
			status = status.join("");
	
			if (dyn[serverid][args[0]].ops.join(">, <@") == []) var opOutput = "None";
			else opOutput = `<@${dyn[serverid][args[0]].ops.join(">, <@")}>`;
			const getEmbed = {
				color: dyn[serverid][args[0]].color,
				thumbnail: image,
				image: image2,
				title: dyn[serverid][args[0]].name,
				description: dyn[serverid][args[0]].desc,
				fields: [
					{ name:"Owner", value: `<@${dyn[serverid][args[0]].ownerid}>`, inline: true},
					{ name:"Operators", value: `${opOutput}`, inline: true},
					{ name:"** **", value: "** **", inline: false},
					{ name:"Members", value: `<@${dyn[serverid][args[0]].members.join(">, <@")}>`, inline: true},
					{ name:"Member Count", value: `${dyn[serverid][args[0]].members.length}`, inline: true},
				],
				footer: {text: `( id: ${args[0]} )`},
				author: {name: `• ${status} •`}
			}
	
			ctx.reply({embeds:[getEmbed]});
		}
		if (command == "list") {
			var serverid = ctx.guild.id;
			fields = []
			
			try {
			for (let i = 0; i < Object.values(dyn[serverid]).length; i++) {
				var status = Object.values(dyn[serverid])[i].status.split("");
				status[0] = status[0].toUpperCase();
				status = status.join("");
				fields.push( {
					name: `• ${Object.values(dyn[serverid])[i].name} ( id: ${Object.values(dyn[serverid])[i].id} )`,
					value: `** ** Owned by <@${Object.values(dyn[serverid])[i].ownerid}>\n** ** Members: ${Object.values(dyn[serverid])[i].member.length}\n** ** ${status}`,
				} );
	
			}} catch(err) {
				return ctx.reply({embeds:[{
					color: 0xFF523A,
					title: `Clans in ${ctx.guild.name}`,
					description: `There are ${fields.length} clans in this server`,
					thumbnail: {url: `${ctx.guild.iconURL()}`},
					fields: [
						{name:"• None", value:"** ** Use !create to start up your own clan!"}
					]
				}]});
			}
	
			if (fields.length == 1) var desc = `There is ${fields.length} clan in this server`;
			else var desc = `There are ${fields.length} clans in this server`;
	
			ctx.reply({embeds:[{
				color: 0xFF523A,
				title: `Clans in ${ctx.guild.name}`,
				description: desc,
				thumbnail: {url: `${ctx.guild.iconURL()}`},
				fields: fields
			}]});
		}
		if (command == "join") {
			args = [];
			args[0] = ctx.options.data[0].value;
			var serverid = ctx.guild.id;
			if (args[0] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please input a clan ID."
				}]});
			}
			try {
			if (dyn[serverid][args[0]].members.includes(ctx.user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You are already in this clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that id."
				}]});
			}
			try {
			if (dyn[serverid][args[0]].status.toLowerCase() == "private") {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That clan is private so you have to have an invite to join."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that id."
				}]});
			}
	
			thing2 = dyn[serverid][args[0]].members;
			thing2.push(ctx.user.id);
			console.log(thing2);
			
			stuff = [args[0], serverid, "members", thing2 ];
			
			dynSet(stuff);
	
			ctx.reply({embeds: [{
				color: 0x57F287,
				description: `<:confirm:1052011206891798618>  You have joined ${dyn[serverid][args[0]].name}.`,
			}]});
		}
		if (command == "leave") {
			args = [];
			args[0] = ctx.options.data[0].value;
			var serverid = ctx.guild.id;
			if (args[0] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please input a clan ID."
				}]});
			}
			try {
			if (!dyn[serverid][args[0]].members.includes(ctx.user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You are not in this clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that id."
				}]});
			}
	
			try {
			if (ctx.user.id == dyn[serverid][args[0]].ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Clan owners cannot leave their own clan."
				}]});
			}} catch(err) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Clan owners cannot leave their own clan."
				}]});
			}
	
			pos = dyn[serverid][args[0]].members.indexOf(ctx.user.id)
			console.log(pos);
			thing2 = dyn[serverid][args[0]].members;
			thing2 = thing2.remove(pos);
			
			stuff = [args[0], serverid, "members", thing2 ];
			
			dynSet(stuff);
	
			if (dyn[serverid][args[0]].ops.includes(ctx.user.id)) {
				pos = dyn[serverid][args[0]].ops.indexOf(ctx.user.id)
				console.log(pos);
				thing2 = dyn[serverid][args[0]].ops;
				thing2 = thing2.remove(pos);
			
				stuff = [args[0], serverid, "ops", thing2 ];
			
				dynSet(stuff);
			}
	
			ctx.reply({embeds: [{
				color: 0x57F287,
				description: `<:confirm:1052011206891798618>  You have left ${dyn[serverid][args[0]].name}.`,
			}]});
		}
		if (command == "invite") {
			args = [];
			args[0] = ctx.options.data[0].value;
			args[1] = ctx.options.data[1].value;
			// invite user clan
			var serverid = ctx.guild.id;
	
			if (args[0] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please input a valid user."
				}]});
			}
			
			var user = args[0].user();
			
			if (!user) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please include a user."
				}]});
			}
	
			if (args[1] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please input a clan ID."
				}]});
			}
	
			try {
				if (user.id == dyn[serverid][args[1]].ownerid) {
					return ctx.reply({embeds: [{
						color: 0xED4245,
						description: "<:decline:1052011672774131762> Pretty sure the owner of the clan is already in the clan."
					}]});
				}} catch(err) {
					return ctx.reply({embeds: [{
						color: 0xED4245,
						description: "<:decline:1052011672774131762> Pretty sure the owner of the clan is already in the clan."
					}]});
				}
			try {
				if (dyn[serverid][args[1]].ops.includes(user.id)) {
					return ctx.reply({embeds: [{
						color: 0xED4245,
						description: "<:decline:1052011672774131762> Pretty sure the operators of the clan are already in the clan."
					}]});
				}} catch(err) {
					return ctx.reply({embeds: [{
						color: 0xED4245,
						description: "<:decline:1052011672774131762> Pretty sure the operators of the clan are already in the clan."
					}]});
				}
			
	
			if (dyn[serverid][args[1]].members.includes(user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Member is already in clan.",
				}]});
			}
			
			if (!dyn[serverid][args[1]].members.includes(ctx.user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You have to be in the clan to invite people.",
				}]});
			}
			
			var row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('inviteAccept')
						.setLabel('Accept')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId('inviteDecline')
						.setLabel('Decline')
						.setStyle(ButtonStyle.Danger),
			);
			
			async function replyLog() {
				await ctx.reply({embeds:[{
					color: 0x3498DB,
					title: "Invite :tada:",
					description: `Hey <@${user.id}>! You were invited to join ${dyn[serverid][args[1]].name} by <@${ctx.user.id}>!`,
					footer: {text: `( id: ${args[1]} )`},
				}],
					components:[row]
				});
				let a = await ctx.fetchReply()
				
				infostuffs[a.id] = [user.id, args[1]];
			}
			
			replyLog();
		}
		if (command == "set") {
			args = [];
			args[0] = ctx.options.data[0].value;
			args[1] = ctx.options.data[1].value;
			args[2] = ctx.options.data[2].value;
			var serverid = ctx.guild.id;
			if (args[0] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please input a clan ID."
				}]});
			}
			try {
			if (args[1] == null || args[2] == null && ctx.options.data[2].attachment.attachment == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Please use the correct arguments for the !set command."
				}]});
			}} catch(err) {
				args[2] = ctx.options.data[2].value;
			}
			if (dyn[serverid][args[0]] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that ID."
				}]});
			}
	
			if (ctx.user.id != dyn[serverid][args[0]].ownerid && !dyn[serverid][args[0]].ops.includes(ctx.user.id)) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Missing permissions to edit this clan.",
				}]});
			}
	
			if (args[2] == "owner" || args[2] == "ownerid" || args[2] == "ops" || args[2] == "id" || args[2] == "ops" || args[2] == "members" || args[2] =="bans") {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> You can't do that :angry:."
				}]});
			}
			
			if (args[1] == "status" && args[2].toLowerCase() != "public" && args[2].toLowerCase() != "private") {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> Status can only be public or private."
				}]});
			}
			
			try {
				if (ctx.options.data[2].attachment.attachment != null && args[1] == "img" || args[1] == "img2") {
					args[2] = ctx.options.data[2].attachment.attachment;
				}
				else {
					args[2] = ctx.options.data[2].value;
				}
			} catch(err) {
				args[2] = ctx.options.data[2].value;
			}
			
			for (var i = 2, setArgs = []; i < args.length; i++) {
				setArgs.push(args[i]);
			}
	
			var thing2 = (args[1] == "status") ? setArgs.join(" ").toLowerCase() : setArgs.join(" ");
			stuff = [args[0], serverid, args[1], thing2 ];
			
			dynSet(stuff);
	
			if (args[1] == "img" || args[1] == "img2") {
				var embed = {
					color: 0x57F287,
					title: `Clan Editing  :tools:`,
					description: `<:confirm:1052011206891798618>  Set ${args[1]} to`,
					image: {url: thing2},
					footer: {text: `( id: ${args[0]} )`}
				}
			}
			else {
				var embed = {
					color: 0x57F287,
					title: `Clan Editing  :tools:`,
					description: `<:confirm:1052011206891798618>  Set ${args[1]} to ${thing2}.`,
					footer: {text: `( id: ${args[0]} )`}
				}
			}
	
			ctx.reply({embeds: [embed]});
		}
	}
	*/
	if (ctx.isButton()) {
		const buttonID = ctx.customId;
		if (buttonID == "help1") {
			var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
			);
			var row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help5")
					.setEmoji("☠️")
					.setStyle(ButtonStyle.Danger),
			);
		
			ctx.update({embeds: [{
				color: 0xFF523A,
				title: "•  Clam  •",
				thumbnail: {url: defaultIcon},
				fields: [{
					name: "__General Commands__  👥", value: `${commandList.General.join("\n")}`,
				}, {
					name: "** **", value: "** **", inline: false
				}],
				footer: {text: `${config.versionText} v${config.version}`},
			}],
				components: [ (theEpic.includes(ctx.user.id)) ? row2 : row ]
			});
		}

		if (buttonID == "help2") {
			var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
			);
			var row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help5")
					.setEmoji("☠️")
					.setStyle(ButtonStyle.Danger),
			);
		
			ctx.update({embeds: [{
				color: 0xFF523A,
				title: "•  Clam  •",
				thumbnail: {url: defaultIcon},
				fields: [{
					name: "__Clan Management__  🛠️", value: `${commandList.Management.join("\n")}`,
				}, {
					name: "** **", value: "** **", inline: false
				}],
				footer: {text: `${config.versionText} v${config.version}`},
			}],
				components: [ (theEpic.includes(ctx.user.id)) ? row2 : row ]
			});
		}
		if (buttonID == "help3") {
			var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
			);
			var row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help5")
					.setEmoji("☠️")
					.setStyle(ButtonStyle.Danger),
			);
		
			ctx.update({embeds: [{
				color: 0xFF523A,
				title: "•  Clam  •",
				thumbnail: {url: defaultIcon},
				fields: [{
					name: "__Clan Moderation__  🛡️", value: `${commandList.Moderation.join("\n")}`,
				}, {
					name: "** **", value: "** **", inline: false
				}],
				footer: {text: `${config.versionText} v${config.version}`},
			}],
				components: [ (theEpic.includes(ctx.user.id)) ? row2 : row ]
			});
		}
		if (buttonID == "help4") {
			var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
			);
			var row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help5")
					.setEmoji("☠️")
					.setStyle(ButtonStyle.Danger),
			);
		
			ctx.update({embeds: [{
				color: 0xFF523A,
				title: "•  Clam  •",
				thumbnail: {url: defaultIcon},
				fields: [{
					name: "__Economy Commands__  💰", value: `${commandList.Economy.join("\n")}`,
				}, {
					name: "** **", value: "** **", inline: false
				}],
				footer: {text: `${config.versionText} v${config.version}`},
			}],
				components: [ (theEpic.includes(ctx.user.id)) ? row2 : row ]
			});
		}
		if (buttonID == "help5") {
			var row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
			);
			var row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('help1')
					.setEmoji("👥")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('help2')
					.setEmoji("🛠️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help3")
					.setEmoji("🛡️")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help4")
					.setEmoji("💰")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("help5")
					.setEmoji("☠️")
					.setStyle(ButtonStyle.Danger),
			);
		
			ctx.update({embeds: [{
				color: 0xFF523A,
				title: "•  Clam  •",
				thumbnail: {url: defaultIcon},
				fields: [{
					name: "__The Epic Commands__  ☠️", value: `${commandList.Epic.join("\n")}`,
				}, {
					name: "** **", value: "** **", inline: false
				}],
				footer: {text: `${config.versionText} v${config.version}`},
			}],
				components: [ (theEpic.includes(ctx.user.id)) ? row2 : row ]
			});
		}
		if (buttonID == "listBigLeft") {
			var serverid = ctx.guild.id;
			var [page, authorid] = infostuffs[ctx.message.id];

			var row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary),
			);

			var row2 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
			);

			if (ctx.member.id != authorid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:."
				}],
					ephemeral: true
				});
			}

			if (clanList(serverid).pageTotal == null) {
				return ctx.update({embeds:[{
					color: 0xFF523A,
					title: `Clans in ${ctx.guild.name}`,
					thumbnail: {url: `${ctx.guild.iconURL()}`},
					footer: {text: `Page 1/1`},
					fields: [
						{name:"• None", value:"** ** Use !create to start up your own clan!"}
					]}],
						components: [row2]
				});
			}
			var page = 0;
			var fields = clanList(serverid)[page];

			if (clanList(serverid).clanTotal == 1) var desc = `There is ${clanList(serverid).clanTotal} clan in this server`;
			else var desc = `There are ${clanList(serverid).clanTotal} clans in this server`;

			let a = await ctx.update({embeds:[{
				color: 0xFF523A,
				title: `Clans in ${ctx.guild.name}`,
				description: desc,
				thumbnail: {url: `${ctx.guild.iconURL()}`},
				fields: fields,
				footer: {text: `Page ${page+1}/${clanList(serverid).pageTotal}`}
			}],
				components: [row]
			});
			
			infostuffs[ctx.message.id] = [page, ctx.member.id];
		}
		if (buttonID == "listLeft") {
			var serverid = ctx.guild.id;
			var [page, authorid] = infostuffs[ctx.message.id];

			var row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary),
			);

			var row2 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
			);

			if (ctx.member.id != authorid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:."
				}],
					ephemeral: true
				});
			}

			if (clanList(serverid).pageTotal == null) {
				return ctx.update({embeds:[{
					color: 0xFF523A,
					title: `Clans in ${ctx.guild.name}`,
					thumbnail: {url: `${ctx.guild.iconURL()}`},
					footer: {text: `Page 1/1`},
					fields: [
						{name:"• None", value:"** ** Use !create to start up your own clan!"}
					]}],
						components: [row2]
				});
			}
			var page = (page-1 < 0) ? clanList(serverid).pageTotal-1 : page-1;
			var fields = clanList(serverid)[page];

			if (clanList(serverid).clanTotal == 1) var desc = `There is ${clanList(serverid).clanTotal} clan in this server`;
			else var desc = `There are ${clanList(serverid).clanTotal} clans in this server`;

			let a = await ctx.update({embeds:[{
				color: 0xFF523A,
				title: `Clans in ${ctx.guild.name}`,
				description: desc,
				thumbnail: {url: `${ctx.guild.iconURL()}`},
				fields: fields,
				footer: {text: `Page ${page+1}/${clanList(serverid).pageTotal}`}
			}],
				components: [row]
			});
		
			infostuffs[ctx.message.id] = [page, ctx.member.id];
		}
		if (buttonID == "listRight") {
			var serverid = ctx.guild.id;
			var [page, authorid] = infostuffs[ctx.message.id];

			var row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary),
			);

			var row2 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
			);

			if (ctx.member.id != authorid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:."
				}],
					ephemeral: true
				});
			}

			if (clanList(serverid).pageTotal == null) {
				return ctx.update({embeds:[{
					color: 0xFF523A,
					title: `Clans in ${ctx.guild.name}`,
					thumbnail: {url: `${ctx.guild.iconURL()}`},
					footer: {text: `Page 1/1`},
					fields: [
						{name:"• None", value:"** ** Use !create to start up your own clan!"}
					]}],
						components: [row2]
				});
			}
			var page = (page+1 > clanList(serverid).pageTotal-1) ? 0 : page+1;
			var fields = clanList(serverid)[page];

			if (clanList(serverid).clanTotal == 1) var desc = `There is ${clanList(serverid).clanTotal} clan in this server`;
			else var desc = `There are ${clanList(serverid).clanTotal} clans in this server`;

			let a = await ctx.update({embeds:[{
				color: 0xFF523A,
				title: `Clans in ${ctx.guild.name}`,
				description: desc,
				thumbnail: {url: `${ctx.guild.iconURL()}`},
				fields: fields,
				footer: {text: `Page ${page+1}/${clanList(serverid).pageTotal}`}
			}],
				components: [row]
			});
		
			infostuffs[ctx.message.id] = [page, ctx.member.id];
		}
		if (buttonID == "listBigRight") {
			var serverid = ctx.guild.id;
			var [page, authorid] = infostuffs[ctx.message.id];

			var row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary),
			);

			var row2 = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('listBigLeft') .setEmoji('⏮️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listLeft') .setEmoji('◀') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listRight') .setEmoji('▶') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
					new ButtonBuilder()
						.setCustomId('listBigRight') .setEmoji('⏭️') .setStyle(ButtonStyle.Secondary) .setDisabled(true),
			);

			if (ctx.member.id != authorid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:."
				}],
					ephemeral: true
				});
			}

			if (clanList(serverid).pageTotal == null) {
				return ctx.update({embeds:[{
					color: 0xFF523A,
					title: `Clans in ${ctx.guild.name}`,
					thumbnail: {url: `${ctx.guild.iconURL()}`},
					footer: {text: `Page 1/1`},
					fields: [
						{name:"• None", value:"** ** Use !create to start up your own clan!"}
					]}],
						components: [row2]
				});
			}
			var page = clanList(serverid).pageTotal-1;
			var fields = clanList(serverid)[page];

			if (clanList(serverid).clanTotal == 1) var desc = `There is ${clanList(serverid).clanTotal} clan in this server`;
			else var desc = `There are ${clanList(serverid).clanTotal} clans in this server`;

			let a = await ctx.update({embeds:[{
				color: 0xFF523A,
				title: `Clans in ${ctx.guild.name}`,
				description: desc,
				thumbnail: {url: `${ctx.guild.iconURL()}`},
				fields: fields,
				footer: {text: `Page ${page+1}/${clanList(serverid).pageTotal}`}
			}],
				components: [row]
			});
		
			infostuffs[ctx.message.id] = [page, ctx.member.id];
		}
		if (buttonID === 'inviteAccept') {
			var serverid = ctx.guild.id;
			var [userid, dynid] = infostuffs[ctx.message.id];
			
			try {
			if (dyn[serverid][dynid].members.includes(userid)) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('inviteAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('inviteDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Invite  :tada:",
					description: `<:decline:1052011672774131762> User is already in clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('inviteAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('inviteDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Invite  :tada:",
					description: `<:decline:1052011672774131762> User is already in clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			if (ctx.member.id != userid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				thing2 = dyn[serverid][dynid].members;
				thing2.push(userid);
		
				stuff = [dynid, serverid, "members", thing2 ];
		
				dynSet(stuff);

				delete infostuffs[ctx.message.id];
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('inviteAccept')
							.setLabel('Accept')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('inviteDecline')
							.setLabel('Decline')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({ embeds:[{
					color: 0x57F287,
					title: "Invite  :tada:",
					description: `<:confirm:1052011206891798618>  Welcome to ${dyn[serverid][dynid].name} <@${userid}>!`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
		}
		if (buttonID == "inviteDecline") {
			var serverid = ctx.guild.id;
			var [userid, dynid] = infostuffs[ctx.message.id];
			
			try {
			if (dyn[serverid][dynid].members.includes(userid)) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('inviteAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('inviteDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Invite  :tada:",
					description: `<:decline:1052011672774131762> User is already in clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('inviteAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('inviteDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Invite  :tada:",
					description: `<:decline:1052011672774131762> User is already in clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != userid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				delete infostuffs[ctx.message.id];
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('inviteAccept')
							.setLabel('Accept')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('inviteDecline')
							.setLabel('Decline')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({ embeds:[{
					color: 0xED4245,
					title: "Invite  :tada:",
					description: `<:decline:1052011672774131762> Sorry guys it looks like <@${userid}> declined your invite. :confused: `,
					footer: {text: `( id: ${dynid} )`}
				}],
						components: [row]
				});
			}
		}
		if (buttonID === 'transferAccept') {
			var serverid = ctx.guild.id;
			var [userid, usertag, ownerid, dynid] = infostuffs[ctx.message.id];
			
			try {
			if (userid == ownerid) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('transferAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('transferDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Owner Transfer :crown:",
					description: `<:decline:1052011672774131762> User already owns the clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('transferAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('transferDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Owner Transfer :crown:",
					description: `<:decline:1052011672774131762> User already owns the clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				if (dyn[serverid][dynid].ops.includes(userid)) {
					pos = dyn[serverid][dynid].ops.indexOf(userid);
					console.log(pos);
					thing2 = dyn[serverid][dynid].ops;
					thing2 = thing2.remove(pos);
				
					stuff = [dynid, serverid, "ops", thing2 ];
		
					dynSet(stuff);
				}
				
				thing2 = dyn[serverid][dynid].ops;
				thing2 = thing2.remove(pos);
				
				stuff = [dynid, serverid, "ops", thing2 ];
		
				dynSet(stuff);
		
				stuff1 = [dynid, serverid, "owner", usertag];
				stuff2 = [dynid, serverid, "ownerid", userid];
		
				dynSet(stuff1);
				dynSet(stuff2);
				
				delete infostuffs[ctx.message.id];
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('transferAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('transferDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0x57F287,
					title: "Owner Transfer :crown:",
					description: `<:confirm:1052011206891798618>  Everyone welcome your new ruler <@${userid}>!`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
		}
		if (buttonID == "transferDecline") {
			var serverid = ctx.guild.id;
			var [userid, usertag, ownerid, dynid] = infostuffs[ctx.message.id];
			
			try {
			if (userid == ownerid) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('transferAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('transferDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Owner Transfer :crown:",
					description: `<:decline:1052011672774131762> User already owns the clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('transferAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('transferDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Owner Transfer :crown:",
					description: `<:decline:1052011672774131762> User already owns the clan.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				delete infostuffs[ctx.message.id];
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('transferAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('transferDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({ embeds:[{
					color: 0xED4245,
					title: "Owner Transfer :crown:",
					description: `<:decline:1052011672774131762> I guess <@${userid}> won't be ruling anytime soon :confused: `,
					footer: {text: `( id: ${dynid} )`}
				}],
				components: [row]
				});
			}
		}
		
		if (buttonID === 'goldAccept') {
			var serverid = ctx.guild.id;
			var [ownerid, dynid, dynid2] = infostuffs[ctx.message.id];
			
			try {
			if (dyn[serverid][dynid2].gold) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('goldAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('goldDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Gold Transfer  <:goldenclam:1052759240885940264>",
					description: `<:decline:1052011672774131762> Clan already has gold.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('goldAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('goldDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Gold Transfer  <:goldenclam:1052759240885940264>",
					description: `<:decline:1052011672774131762> Clan already has gold.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				stuff = [dynid, serverid, "flag", false ];
				dynSet(stuff);
				stuff2 = [dynid2, serverid, "flag", true ];
				dynSet(stuff2);

				delete infostuffs[ctx.message.id];
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('goldAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('goldDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0x57F287,
					title: "Gold Transfer  <:goldenclam:1052759240885940264>",
					description: `<:confirm:1052011206891798618> Lookin shiny ${dyn[serverid][dynid2].name}!`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
		}
		if (buttonID == "goldDecline") {
			var serverid = ctx.guild.id;
			var [ownerid, dynid, dynid2] = infostuffs[ctx.message.id];
			
			try {
			if (dyn[serverid][dynid2].gold) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('goldAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('goldDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Gold Transfer  <:goldenclam:1052759240885940264>",
					description: `<:decline:1052011672774131762> Clan already has gold.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('goldAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('goldDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Gold Transfer  <:goldenclam:1052759240885940264>",
					description: `<:decline:1052011672774131762> Clan already has gold.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				delete infostuffs[ctx.message.id];
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('goldAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('goldDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({ embeds:[{
					color: 0xED4245,
					title: "Gold Transfer  <:goldenclam:1052759240885940264>",
					description: `<:decline:1052011672774131762> I guess ${dyn[serverid][dynid].name} wants to keep all the gold to themselves.`,
					footer: {text: `( id: ${dynid} )`}
				}],
				components: [row]
				});
			}
		}
		if (buttonID === 'disbandAccept') {
			var serverid = ctx.guild.id;
			var [dynid, name] = infostuffs[ctx.message.id];
			
			try {
			if (dyn[serverid][dynid] == null) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('disbandAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('disbandDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Disbanding :wastebasket:",
					description: `<:decline:1052011672774131762> Clan is already disbanded.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('disbandAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('disbandDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Disbanding :wastebasket:",
					description: `<:decline:1052011672774131762> Clan is already disbanded.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != dyn[serverid][dynid].ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				var thing2 = dyn[serverid];
				delete thing2[dynid]
		
				data = JSON.stringify(dyn, null, 4);
				var parse = JSON.parse(data);
		
				parse[serverid] = thing2;

				json = JSON.stringify(parse, null, 4);
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('disbandAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('disbandDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);

				ctx.update({embeds: [{
					color: 0x57F287,
					title: "Clan Disbanding :wastebasket:",
					description: `<:confirm:1052011206891798618>  Disbanded ${name}.`,
					footer: {text: `(id: ( ${dynid} )`}
				}],
					components: [row]
				});

				dyn = JSON.parse(json);

				fs.writeFile(file, json, 'utf8', function callback(){});
				delete infostuffs[ctx.message.id];
			}
		}
		if (buttonID == "disbandDecline") {
			var serverid = ctx.guild.id;
			var [dynid, name] = infostuffs[ctx.message.id];
			var oldOwner = dyn[serverid][dynid].ownerid;
			
			try {
			if (dyn[serverid][dynid] == null) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('disbandAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('disbandDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Disbanding :wastebasket:",
					description: `<:decline:1052011672774131762> Clan is already disbanded.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('disbandAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('disbandDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Disbanding :wastebasket:",
					description: `<:decline:1052011672774131762> Clan is already disbanded.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != dyn[serverid][dynid].ownerid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				delete infostuffs[ctx.message.id];
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('disbandAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('disbandDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				return ctx.update({ embeds:[{
					color: 0xED4245,
					title: "Clan Disbanding :wastebasket:",
					description: `<:decline:1052011672774131762> ${name} lives on for another day! `,
					footer: {text: `( id: ${dynid} )`}
				}],
				components: [row]
				});
			}
		}
		if (buttonID === 'fdAccept') {
			var serverid = ctx.guild.id;
			var [dynid, name] = infostuffs[ctx.message.id];
			
			try {
			if (dyn[serverid][dynid] == null) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('fdAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('fdDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Force Deletion :skull_crossbones:",
					description: `<:decline:1052011672774131762> Clan is already deleted.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('fdAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('fdDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Force Deletion :skull_crossbones:",
					description: `<:decline:1052011672774131762> Clan is already deleted.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != theEpic) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				var thing2 = dyn[serverid];
				delete thing2[dynid]
		
				data = JSON.stringify(dyn, null, 4);
				var parse = JSON.parse(data);
		
				parse[serverid] = thing2;

				json = JSON.stringify(parse, null, 4);
				
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('fdAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('fdDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);

				ctx.update({embeds: [{
					color: 0x57F287,
					title: "Clan Force Deletion :skull_crossbones:",
					description: `<:confirm:1052011206891798618>  Deleted ${name} by force.`,
					footer: {text: `(id: ( ${dynid} )`}
				}],
					components: [row]
				});

				dyn = JSON.parse(json);

				fs.writeFile(file, json, 'utf8', function callback(){});
				delete infostuffs[ctx.message.id];
			}
		}
		if (buttonID == "fdDecline") {
			var serverid = ctx.guild.id;
			var [dynid, name] = infostuffs[ctx.message.id];
			var oldOwner = dyn[serverid][dynid].ownerid;
			
			try {
			if (dyn[serverid][dynid] == null) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('fdAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('fdDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Force Deletion :skull_crossbones:",
					description: `<:decline:1052011672774131762> Clan is already deleted.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}} catch(err) {
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('fdAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('fdDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				
				return ctx.update({embeds: [{
					color: 0xED4245,
					title: "Clan Force Deletion :skull_crossbones:",
					description: `<:decline:1052011672774131762> Clan is already deleted.`,
					footer: {text: `( id: ${dynid} )`}
				}],
					components: [row]
				});
			}
			
			if (ctx.member.id != theEpic) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			else {
				delete infostuffs[ctx.message.id];
				var row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('fdAccept')
							.setLabel('Yes')
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId('fdDecline')
							.setLabel('No')
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				);
				return ctx.update({ embeds:[{
					color: 0xED4245,
					title: "Clan Force Deletion :skull_crossbones:",
					description: `<:decline:1052011672774131762> ${name} lives on for another day! `,
					footer: {text: `( id: ${dynid} )`}
				}],
				components: [row]
				});
			}
		}
		if (buttonID == "clanHome") {
			var [serverid, userid, id] = infostuffs[ctx.message.id];
			if (dyn[serverid][id] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that ID."
				}]});
			}
			if (ctx.member.id != userid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			var clan = dyn[serverid][id];
			var image = clan.img; while (image.includes(" ")) { image = image.replace(" ", "_"); } image = { url: image };
			var image2 = clan.img2; while (image2.includes(" ")) { image2 = image2.replace(" ", "_"); } image2 = { url: image2 };
			var status = clan.status.split(""); status[0] = status[0].toUpperCase(); status = status.join("");
			var opOutput = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
			var memOutput = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;

			var row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('clanHome')
						.setEmoji("🏡")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('clanStats')
						.setEmoji("📊")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('clanEconomy')
						.setEmoji("💰")
						.setStyle(ButtonStyle.Secondary),
			);
			const getEmbed = {
				color: (clan.color == "rank") ? balColor(clan.funds)[0] : clan.color.colorForm(),
				thumbnail: image,
				image: image2,
				title: (clan.flag) ? `${clan.name}  <:goldenclam:1052759240885940264>` : clan.name,
				description: `${clan.desc}\n\n`,
				fields: [
					{ name:"** **\nShout:", value: `"${clan.shout}" - <@${clan.shoutUser}>` , inline: false},
					{ name:"** **", value: "** **", inline: false},
					{ name:"Owner", value: `<@${clan.ownerid}>`, inline: true},
					{ name:"** **", value: "** **", inline: true},
					{ name:"Operators", value: `${opOutput}`, inline: true},
					{ name:"** **", value: "** **", inline: false},
					/*{ name:"** **", value: "** **", inline: false},
					{ name:"Members", value: `${memOutput}`, inline: true},
	 				{ name:"** **", value: "** **", inline: true},
					{ name:"Member Count", value: `${clan.members.length}`, inline: true},
					{ name:"** **", value: "** **", inline: false}, */
					/*{ name:"** **", value: "** **", inline: false},
					{ name:"Funds", value: "`"+pearl+m(clan.funds)+"`", inline: true},
	 				{ name:"** **", value: "** **", inline: true},
					{ name:"Rank", value: "`"+balColor(clan.funds)[1]+"`", inline: true},
					{ name:"** **", value: "** **", inline: false}, */
				],
				footer: {text: (ctx.guild.id == serverid) ? `( id: ${id} )` : `( guild id: ${serverid} )\n( clan id: ${id} )`},
				author: {name: `• ${status} •`}
			}
			// "`" + `Funds:  ${"🔘" + m(clan.funds)}  |  Rank:    ${balColor(clan.funds)[1]+"`"}
			
			ctx.update({embeds:[getEmbed], components: [row]});
		}
		if (buttonID == "clanStats") {
			var [serverid, userid, id] = infostuffs[ctx.message.id];
			if (dyn[serverid][id] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that ID."
				}]});
			}
			if (ctx.member.id != userid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			var clan = dyn[serverid][id];
			var image = clan.img; while (image.includes(" ")) { image = image.replace(" ", "_"); } image = { url: image };
			var image2 = clan.img2; while (image2.includes(" ")) { image2 = image2.replace(" ", "_"); } image2 = { url: image2 };
			var status = clan.status.split(""); status[0] = status[0].toUpperCase(); status = status.join("");
			var opOutput = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
			var memOutput = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;

			var row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('clanHome')
						.setEmoji("🏡")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('clanStats')
						.setEmoji("📊")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('clanEconomy')
						.setEmoji("💰")
						.setStyle(ButtonStyle.Secondary),
			);
			const getEmbed = {
				color: (clan.color == "rank") ? balColor(clan.funds)[0] : clan.color.colorForm(),
				thumbnail: image,
				image: image2,
				title: (clan.flag) ? `${clan.name}  <:goldenclam:1052759240885940264>` : clan.name,
				description: `${clan.desc}\n\n`,
				fields: [
					{ name:"** **\nShout:", value: `"${clan.shout}" - <@${clan.shoutUser}>` , inline: false},
					/*{ name:"** **", value: "** **", inline: false},
					{ name:"Owner", value: `<@${clan.ownerid}>`, inline: true},
					{ name:"** **", value: "** **", inline: true},
					{ name:"Operators", value: `${opOutput}`, inline: true},
					{ name:"** **", value: "** **", inline: false},*/
					{ name:"** **", value: "** **", inline: false},
					{ name:"Members", value: `${memOutput}`, inline: true},
					{ name:"** **", value: "** **", inline: true},
					{ name:"Member Count", value: `${clan.members.length}`, inline: true},
					{ name:"** **", value: "** **", inline: false},
					/*{ name:"** **", value: "** **", inline: false},
					{ name:"Funds", value: "`"+pearl+m(clan.funds)+"`", inline: true},
	 				{ name:"** **", value: "** **", inline: true},
					{ name:"Rank", value: "`"+balColor(clan.funds)[1]+"`", inline: true},
					{ name:"** **", value: "** **", inline: false}, */
				],
				footer: {text: (ctx.guild.id == serverid) ? `( id: ${id} )` : `( guild id: ${serverid} )\n( clan id: ${id} )`},
				author: {name: `• ${status} •`}
			}
			// "`" + `Funds:  ${"🔘" + m(clan.funds)}  |  Rank:    ${balColor(clan.funds)[1]+"`"}
			
			ctx.update({embeds:[getEmbed], components: [row]});
		}
		if (buttonID == "clanEconomy") {
			var [serverid, userid, id] = infostuffs[ctx.message.id];
			if (dyn[serverid][id] == null) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> There is no clan with that ID."
				}]});
			}
			if (ctx.member.id != userid) {
				return ctx.reply({embeds: [{
					color: 0xED4245,
					description: "<:decline:1052011672774131762> That's not meant for you :angry:.",
					footer: {text: `( id: ${dynid} )`}
				}],
					ephemeral: true
				});
			}
			var clan = dyn[serverid][id];
			var image = clan.img; while (image.includes(" ")) { image = image.replace(" ", "_"); } image = { url: image };
			var image2 = clan.img2; while (image2.includes(" ")) { image2 = image2.replace(" ", "_"); } image2 = { url: image2 };
			var status = clan.status.split(""); status[0] = status[0].toUpperCase(); status = status.join("");
			var opOutput = (clan.ops.join(">, <@") == []) ? "None" : `<@${clan.ops.join(">, <@")}>`;
			var memOutput = (clan.members.join(">, <@") == []) ? "None" : `<@${clan.members.join(">, <@")}>`;

			var row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('clanHome')
						.setEmoji("🏡")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('clanStats')
						.setEmoji("📊")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('clanEconomy')
						.setEmoji("💰")
						.setStyle(ButtonStyle.Primary),
			);
			const getEmbed = {
				color: (clan.color == "rank") ? balColor(clan.funds)[0] : clan.color.colorForm(),
				thumbnail: image,
				image: image2,
				title: (clan.flag) ? `${clan.name}  <:goldenclam:1052759240885940264>` : clan.name,
				description: `${clan.desc}\n\n`,
				fields: [
					{ name:"** **\nShout:", value: `"${clan.shout}" - <@${clan.shoutUser}>` , inline: false},
					/*{ name:"** **", value: "** **", inline: false},
					{ name:"Owner", value: `<@${clan.ownerid}>`, inline: true},
					{ name:"** **", value: "** **", inline: true},
					{ name:"Operators", value: `${opOutput}`, inline: true},
					{ name:"** **", value: "** **", inline: false},*/
					/*{ name:"** **", value: "** **", inline: false},
					{ name:"Members", value: `${memOutput}`, inline: true},
	 				{ name:"** **", value: "** **", inline: true},
					{ name:"Member Count", value: `${clan.members.length}`, inline: true},
					{ name:"** **", value: "** **", inline: false},*/
					{ name:"** **", value: "** **", inline: false},
					{ name:"Funds", value: "`"+pearl+m(clan.funds)+"`", inline: true},
					{ name:"** **", value: "** **", inline: true},
					{ name:"Rank", value: "`"+balColor(clan.funds)[1]+"`", inline: true},
					{ name:"** **", value: "** **", inline: false},
				],
				footer: {text: (ctx.guild.id == serverid) ? `( id: ${id} )` : `( guild id: ${serverid} )\n( clan id: ${id} )`},
				author: {name: `• ${status} •`}
			}
			// "`" + `Funds:  ${"🔘" + m(clan.funds)}  |  Rank:    ${balColor(clan.funds)[1]+"`"}
			
			ctx.update({embeds:[getEmbed], components: [row]});
		}
	}} catch(error) {
		console.log(`\n${error}`);
		return ctx.reply({embeds: [{
			color: 0xED4245,
			title: "Oops!  :nerd:",
			description: "Your command timed out or the bot restarted."
		}],
			ephemeral: true	 
		});
	}
});

function dynCreate(stuff) {
	var [name, desc, img, img2, color, id, serverid, owner, ownerid] = stuff;
	if (dyn[serverid] == null) {
		data = JSON.stringify(dyn, null, 4);
		var parse = JSON.parse(data);
		parse[serverid] = {};
		json = JSON.stringify(parse, null, 4);
		
		fs.writeFile(file, json, 'utf8', function callback(){});
		var res = json;
	}

	if (res != null) dyn = JSON.parse(res); res = null;

	if (dyn[serverid][id] == null) {
		data = JSON.stringify(dyn, null, 4);
		var parse = JSON.parse(data);
		parse[serverid][id] = {};
		json = JSON.stringify(parse, null, 4);
		
		fs.writeFile(file, json, 'utf8', function callback(){});
		var res = json;
	}
	else {
		return console.log("There is already a clan with that ID.");
	}

	if (res != null) dyn = JSON.parse(res); res = null;

	data = JSON.stringify(dyn);
	var parse = JSON.parse(data);
	parse[serverid][id]["name"] = name;
	parse[serverid][id]["desc"] = desc;
	parse[serverid][id]["shout"] = "You can use !shout to change the shout.";
	parse[serverid][id]["shoutUser"] = "1050917862233100508";
	parse[serverid][id]["id"] = id;
	parse[serverid][id]["img"] = img;
	parse[serverid][id]["img2"] = img2;
	parse[serverid][id]["color"] = color;
	parse[serverid][id]["owner"] = owner;
	parse[serverid][id]["ownerid"] = ownerid;
	parse[serverid][id]["members"] = [ownerid];
	parse[serverid][id]["ops"] = [];
	parse[serverid][id]["banned"] = [];
	parse[serverid][id]["status"] = "Public";
	parse[serverid][id]["flag"] = (flagCheck(dyn[serverid])) ? false : true;
	parse[serverid][id]["funds"] = 0;

	json = JSON.stringify(parse, null, 4);

	dyn = JSON.parse(json);

	fs.writeFile(file, json, 'utf8', function callback(){});
}

function dynSet(stuff) {
	[id, serverid, thing1, thing2] = stuff;
	if (dyn[serverid] == null || dyn[serverid][id] == null) {
		return console.log(`There is no clan with that ID. (${id})`);
	}
	else {
		data = JSON.stringify(dyn, null, 4);
		var parse = JSON.parse(data);
		
		parse[serverid][id][thing1] = thing2;

		json = JSON.stringify(parse, null, 4);

		dyn = JSON.parse(json);

		fs.writeFile(file, json, 'utf8', function callback(){});
	}
}

function econSet(stuff) {
	var [id, amount, type] = stuff;
	if (econ[id] == null) { econ[id] = 0; }
	
	data = JSON.stringify(econ, null, 4);
	var parse = JSON.parse(data);
		
	parse[id] = (type == 0 /* set to */) ? m2(amount) : (type == 1 /* add */) ? parse[id] + m2(amount) : parse[id] - m2(amount);

	json = JSON.stringify(parse, null, 4);

	econ = JSON.parse(json);

	fs.writeFile(file2, json, 'utf8', function callback(){});
}

function dynCount(stuff) {
	var dynT = 0;
	for (let i = 0; i < Object.keys(stuff).length; i++) {
		dynT += Object.keys( stuff [Object.keys(stuff)[i]] ).length;
	}
	return dynT;
}

function flagCheck(stuff) {
	for (let i = 0; i < Object.keys(stuff).length; i++) {
		if (stuff[Object.keys(stuff)[i]].flag) {
			return true;
		}
	}
	return false;
}

function userList(id, serverid) {
	var list = {};
	for (let i = 0, page = 0, l = 0; i < Object.values(dyn[serverid]).length; i++, l++) {
		if ( Object.values(dyn[serverid])[i].members.includes(id) ) {
			if (l >= 5) { page++; l=0; }
			list[page] = (l == 0) ? [] : list[page];
			var status = Object.values(dyn[serverid])[i].status.split("");
			status[0] = status[0].toUpperCase();
			status = status.join("");
			list[page].push( {
				name: (Object.values(dyn[serverid])[i].flag) ? `• ${Object.values(dyn[serverid])[i].name}  <:goldenclam:1052759240885940264>  ( id: ${Object.values(dyn[serverid])[i].id} )` : `• ${Object.values(dyn[serverid])[i].name} ( id: ${Object.values(dyn[serverid])[i].id} )`,
				value: `** ** Owned by <@${Object.values(dyn[serverid])[i].ownerid}>\n** ** Members: ${Object.values(dyn[serverid])[i].members.length}\n** ** ${status}`
			} );
			list["clanTotal"] = i+1;
			list["pageTotal"] = page+1;
		}
	}
	return list;
}

function clanList(serverid) {
	var list = {};
	for (let i = 0, page = 0, l = 0; i < Object.values(dyn[serverid]).length; i++, l++) {
		if (l >= 5) { page++; l=0; }
		list[page] = (l == 0) ? [] : list[page];
		var status = Object.values(dyn[serverid])[i].status.split("");
		status[0] = status[0].toUpperCase();
		status = status.join("");
		list[page].push( {
			name: (Object.values(dyn[serverid])[i].flag) ? `• ${Object.values(dyn[serverid])[i].name}  <:goldenclam:1052759240885940264>  ( id: ${Object.values(dyn[serverid])[i].id} )` : `• ${Object.values(dyn[serverid])[i].name} ( id: ${Object.values(dyn[serverid])[i].id} )`,
			value: `** ** Owned by <@${Object.values(dyn[serverid])[i].ownerid}>\n** ** Members: ${Object.values(dyn[serverid])[i].members.length}\n** ** ${status}`
		} );
		list["clanTotal"] = i+1;
		list["pageTotal"] = page+1;
	}
	return list;
}

function getGlobal(id) {
	for (let s = 0; s < Object.values(dyn).length; s++) {
		var server = Object.values(dyn)[s];
		for (let i = 0; i < Object.values(server).length; i++) {
			var clan = Object.values(server)[i];
			if (clan.id == id) {
				clan["serverid"] = Object.keys(dyn)[s];
				return clan;
			}
		}
	}
	return null;
}

bot.login(config.token);
