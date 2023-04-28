var { psc, bot } = require('../../index.js');
var { icon } = require('../../config/defaults.json');
var { version, versionText } = require('../../config/config.json');

const { Soup } = require('stews');

async function data(ctx) {
    const selectID = ctx.values[0];

	if (selectID.startsWith("clamSearch/")) {

		/* getting the stuff */
		let [_, category, name] = selectID.split("/");


		/* getting the category's commands */
		var list = require('../../config/list.json')[category];
		var cmd = list.filter( (v) => { return v.name == name })[0];

		let titleName = name.split("");titleName[0]=titleName[0].toUpperCase();titleName=titleName.join("")

		
		/* embed stuff */
		let embed = new psc.Embed({
			title: `${titleName} Command`,
			
			fields: [
				{ name: "Description", value: `• ${cmd.desc}`, inline: true },
				{ name: "Category", value: `• ${category}`, inline: true },
				{ name: "** **", value: "** **", inline: true },
				{ name: "Arguments", value: (cmd.args.length > 0) ? "• `"+cmd.args.join("`, `")+"`" : "• None", inline: true },
				{ name: "Aliases", value: (cmd.aliases.length > 0) ? "• !"+cmd.aliases.join(", !") : "• None", inline: true },
				{ name: "** **", value: "** **", inline: false }
			],

			footer: `${versionText} v${version}`,
			thumbnail: icon,
			
			color: psc.colors.clam
		});

		ctx.update({ embeds: [embed] }).catch(e=>{});
	}
}


psc.selectionAction(data);
