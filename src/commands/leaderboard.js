var { psc, bot } = require('../../index.js');
var { colors, colorify, pearl, pearlify, emojis } = require('../assets');
var { Soup } = require('stews');

async function data(ctx, cmd) {
	const { Econner, Catch } = require('../classes');
	let econner = new Econner();


	/* getting the leaderboards */
	var clanLB = Soup.from(await econner.clanLB(ctx.guild.id));
	var userLB = Soup.from(await econner.userLB(ctx.guild.id));


	/* fixing the leaderboards */
	clanLB = clanLB.mapKey( (k, v) => {
		let stuff = k.split("/");
		stuff.shift();
		return stuff.join("");
	});


	let userRanks = new Soup(Object);
	userLB.forEach( (k, v, i) => {
		let rank = `${i+1}${((int) => {
			if (int > 3 && int < 21) return "th";
			switch( int % 10) {
				case 1: return "st"; break;
				case 2: return "nd"; break;
				case 3: return "rd"; break;
				default: return "th"; break;
			}
		})(i+1)}`;

		userRanks.push(k, rank);
	});
	

	let clanRanks = new Soup(Object);
	clanLB.forEach( (k, v, i) => {
		let rank = `${i+1}${((int) => {
			if (int > 3 && int < 21) return "th";
			switch( int % 10) {
				case 1: return "st"; break;
				case 2: return "nd"; break;
				case 3: return "rd"; break;
				default: return "th"; break;
			}
		})(i+1)}`;

		clanRanks.push(k, rank);
	});


	var userRank = (userRanks.includes(ctx.author.id)) ? userRanks.get(ctx.author.id) : null;


	let guild = ctx.guild.name.split("");
	guild[0] = guild[0].toUpperCase();
	guild = guild.join("");


	/* setup for embed fields and stuff */
	let userFields = new Soup(Array);

	userRanks.forEach( (k, v, i) => {
		let stuff = `${ (k == ctx.author.id) ? `**${v}**` : `${v}` }:**  **<@${k}>**  **•**  **${"`"+pearl}${pearlify(userLB.get(i))+"`"}`;
		userFields.push(stuff);
	});


	if (userFields.length > 3) {
		userFields.scoop( (_, i) => {
			return i >= 3;
		});
		userFields.push("\n...\n");
		let rankInt = userRanks.indexOf(ctx.author.id)+1;
		if (rankInt > 3) {
			if (userRanks.get(rankInt-2)) userFields.push(`${userRanks.get(rankInt-2)}:**  **<@${userRanks.keys[rankInt-2]}>**  **•**  **${"`"+pearl}${pearlify(userLB.get(rankInt-2))+"`"}`);

			userFields.push(`**${userRank}**:**  **<@${ctx.author.id}>**  **•**  **${"`"+pearl}${pearlify(userLB.get(rankInt-1))+"`"}`);

			if (userRanks.get(rankInt)) userFields.push(`${userRanks.get(rankInt)}:**  **<@${userRanks.keys[rankInt]}>**  **•**  **${"`"+pearl}${pearlify(userLB.get(rankInt))+"`"}`);
		}
	}


	let clanFields = new Soup(Array);


	/* embed stuff */
	let embed = new psc.Embed({
		author: { name: `${guild} Leaderboard` },
		description: (userRank) ? `You are ranked **${userRank}**.` : "You aren't on the leaderboard yet.",

		fields: [
			{ name: "Users", value: userFields.join("\n"), inline: true },
			{ name: "** **", value: "** **", inline: true },
			{ name: "Clans", value: "a", inline: true }
		],

		color: colors.clam,
		thumbnail: ctx.guild.iconURL()
	});

	ctx.reply({ embeds: [embed] });

	/*
    if (typeof userRank == "number") {
		userRank = `${userRank}${((int) => {
			if (int > 3 && int < 21) return "th";
			switch( int % 10) {
				case 1: return "st"; break;
				case 2: return "nd"; break;
				case 3: return "rd"; break;
				default: return "th"; break;
			}
		})(userRank)}`;
	}
    */
	
	
}

psc.command({name: "leaderboard", aliases: ["lb"]}, data);
