var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	let clans = new Clanner();
	let id = cmd.args[0];
	
    
    /* handling */
    if (
    	Catch( !id, { text: 'Please put a clan ID.' }) ||
        Catch( !clans.has(id, ctx.guild.id), { text: "There is no clan with that ID." })
    ) return;


	var clan = clans.fetch(id);
	
	
	if ( Catch( ctx.author.id != clan.owner, { text: "Only the owner of the clan can disband it." }) ) return;
	

	let embed = new psc.Embed({
		description: `${emojis.success} Disbanded ${clan.name}`,
		footer: `( id: ${clan.id} )`
	});

	ctx.reply({ embeds: [embed] });
	
	clans.disband(id, ctx.guild.id);
}

psc.command("disband", data);
