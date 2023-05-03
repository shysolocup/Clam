var { psc, bot } = require('../../index.js');
var { colors, isDev, emojify } = require('../assets');

var { icon } = require('../../config/defaults.json');
var { version, versionText } = require('../../config/config.json');

const { Soup } = require('stews');


async function data(ctx) {
	var buttonID = ctx.customId;

	if (buttonID.startsWith("clamHelp/")) {
		var [ _, category, guildID ] = buttonID.split("/");
		var stuff = Soup.from(require('../../config/list.json')[category]);


		var prefixes = require('../../config/prefixes.json');
        var prefix = (prefixes instanceof Object && prefixes[guildID]) ? prefixes[guildID] : (prefixes instanceof Object) ? prefixes.default : prefixes;

	
		/* button shit */
		let buttons = ctx.message.components[1].components;
        buttons = buttons.map( (button) => { return button.data; });
	
	
		/* select menu shit */
		var options = [];
		
		stuff.forEach( (com) => {
			options.push({
				label: `${prefix}${com.name}`,
				value: `clamSearch/${category}/${com.name}/${guildID}`,
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
		var comps = [ [search], buttons ];
	
		comps = comps.map( (btns) => { return new psc.ActionRow(btns); });
		
		var desc = stuff.copy().map( (com) => {
			return `${prefix}${com.name}: ${ "`"+com.desc+"`" }`;
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
		
		ctx.update({ embeds: [embed], components: comps }).catch(e=>{});
	}
}

psc.buttonAction(data);
