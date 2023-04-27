var { psc, bot } = require('../../index.js');
var { colors, emojis, isDev, emojify } = require('../assets');

var { icon } = require('../../config/defaults.json');
var { version, versionText } = require('../../config/config.json');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	var category = "General";
	var stuff = Soup.from(require('../../config/list.json')[category]);
	var all = Soup.from(Soup.from(require('../../config/list.json')));

	let disabled = !(psc.author.hasPermissions(["admin"]) || isDev(ctx.author.id));
	if (disabled) all.delete("Administrator");


	/* button shit */
	let general = new psc.Button({ id: "clamHelp/General", emoji: "👥", style: "secondary"});
	let manage = new psc.Button({ id: "clamHelp/Management", emoji: "🛠️", style: "secondary"});
	let mod = new psc.Button({ id: "clamHelp/Moderation", emoji: "🛡️", style: "secondary"});
	let economy = new psc.Button({ id: "clamHelp/Economy", emoji: "💰", style: "secondary"});
	let admin = new psc.Button({ id: "clamHelp/Administrator", emoji: (disabled) ? "🔒" : "🔓", style: "danger", disabled: disabled});


	/* select menu shit */
	var options = [];

	if (cmd.args[0]) {
		var the = all.values.flat().filter( (v) => { return v.name == cmd.args[0] });

		if (the.length <= 0) {
			return psc.reply({ embeds: [
				new psc.Embed({
					description: `${emojis.decline} I couldn't find a command with that name.`,
					color: colors.decline
				})
			], deleteAfter: "3s" });
		}

		[ category, stuff ] = all.filter( (_, c) => {
			return c.includes(the[0]);
		}).pour(Array)[0];

		stuff = Soup.from(stuff);
	}
	
	stuff.forEach( (com) => {
		options.push({
			label: `!${com.name}`,
			value: `clamSearch/${category}/${com.name}`,
			description: com.desc
		});
	});

	let search = new psc.Selection({
		id: "helpSearch",
		placeholder: `Search ${category}`,
		options: options,
		min: 1,
		max: 1
	});


	/* more button shit */
	var btns = [ general, manage, mod, economy, admin ];
	var comps = [ [search], btns ];

	comps = comps.map( (btns) => { return new psc.ActionRow(btns); });
	
	var desc = stuff.copy().map( (com) => {
		return `!${com.name}: ${ "`"+com.desc+"`" }`;
	});
	

	/* embed stuff */
	var embed;
	
	if (cmd.args[0]) {
		let titleName = cmd.args[0].split("");titleName[0]=titleName[0].toUpperCase();titleName=titleName.join("");
		
		embed = new psc.Embed({
			title: `${titleName} Command`,
			
			fields: [
				{ name: "Description", value: `• ${the[0].desc}`, inline: true },
				{ name: "Category", value: `• ${category}`, inline: true },
				{ name: "** **", value: "** **", inline: true },
				{ name: "Arguments", value: (the[0].args.length > 0) ? "• `"+the[0].args.join("`, `")+"`" : "• None", inline: true },
				{ name: "Aliases", value: (the[0].aliases.length > 0) ? "• !"+the[0].aliases.join(", !") : "• None", inline: true },
				{ name: "** **", value: "** **", inline: false }
			],

			footer: `${versionText} v${version}`,
			thumbnail: icon,
			
			color: psc.colors.clam
		});
	}
	
	else {
		embed = new psc.Embed({
			title: `${category} Commands  ${emojify(category)}`,
			description: desc.join("\n"),
	
			fields: [
				{ name: "** **", value: "** **" }
			],
			
			footer: `${versionText} v${version}`,
			thumbnail: icon,
	
			color: psc.colors.clam
		});
	}


	/* the dming */
	try {
		await ctx.author.send({ embeds: [embed], components: comps });
	}
	catch(err) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${emojis.decline} Your DMs are off so I can't send you the stuff :(`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}

	psc.reply({embeds: [{
		color: 0x3498DB,
		description: `Check the DM I sent you!`,
	}],
		deleteAfter: "5s"
	});
}

psc.command("help", data);
