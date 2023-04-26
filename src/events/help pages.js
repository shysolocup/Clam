var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji, declineEmoji, isDev, emojify } = require('../assets');

var { icon } = require('../../config/defaults.json');
var { version, versionText } = require('../../config/config.json');

const { Soup } = require('stews');


async function data(ctx) {
	var buttonID = ctx.customId;

	if (buttonID.startsWith("clamHelp/")) {
		var category = buttonID.split("clamHelp/")[1];
		var stuff = Soup.from(require('../../config/list.json')[category]);

	
		/* button shit */
		let buttons = ctx.message.components[1].components;
        buttons = buttons.map( (button) => { return button.data; });
	
	
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
		var comps = [ [search], buttons ];
	
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
		
		ctx.update({ embeds: [embed], components: comps });
	}
}

psc.buttonAction(data);
