var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji, isDev, emojify } = require('../assets');

var { icon } = require('../../config/defaults.json');
var { version, versionText } = require('../../config/config.json');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	var category = "General";
	var stuff = Soup.from(require('../../config/list.json')[category]);

	let disabled = !(psc.author.hasPermissions(["admin"]) || isDev(ctx.author.id));

	/* button shit */
	let general = new psc.Button({ id: "clamHelp/General", emoji: "👥", style: "secondary"});
	let manage = new psc.Button({ id: "clamHelp/Management", emoji: "🛠️", style: "secondary"});
	let mod = new psc.Button({ id: "clamHelp/Moderation", emoji: "🛡️", style: "secondary"});
	let economy = new psc.Button({ id: "clamHelp/Economy", emoji: "💰", style: "secondary"});
	let admin = new psc.Button({ id: "clamHelp/Administrator", emoji: (disabled) ? "🔒" : "🔓", style: "danger", disabled: disabled});


	/* select menu shit */
	var options = [];
	
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
	var btns = [general, manage, mod, economy, admin];
	var comps = [ [search], btns ];

	comps = comps.map( (btns) => { return new psc.ActionRow(btns); });
	
	var desc = stuff.copy().map( (com) => {
		return `!${com.name}: ${ "`"+com.desc+"`" }`;
	});
	

	/* embed stuff */
	let embed = new psc.Embed({
		title: `${category} Commands  ${emojify(category)}`,
		description: desc.join("\n"),

		fields: [
			{ name: "** **", value: "** **" }
		],
		
		footer: `${versionText} v${version}`,
		thumbnail: icon,

		color: psc.colors.clam
	});


	/* the dming */
	try {
		await ctx.author.send({ embeds: [embed], components: comps });
	}
	catch(err) {
		return psc.reply({ embeds: [
			new psc.Embed({
				description: `${declineEmoji} Your DMs are off so I can't send you the stuff :(`,
				color: colors.decline
			})
		], deleteAfter: "3s" });
	}

	ctx.reply({embeds: [{
		color: 0x3498DB,
		description: `Check the DM I sent you for the help page!`,
	}]});
}

psc.command("help", data);
