var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets');
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
	
    
    /* buttons n stuff */
    let disbandAccept = new psc.Button({ id: "disbandAccept", label: "Yes", style: "success"});
    let disbandDecline = new psc.Button({ id: "disbandDecline", label: "No", style: "danger"});

    let row = new psc.ActionRow([disbandAccept, disbandDecline]);


    /* embed stuff */
    let embed = new psc.Embed({
        title: `Clan Disbanding  🗑️`,
        description: `Are you sure you would like to disband ${"`"+clan.name+"`"}`,

        footer: `( id: ${clan.id} )`,

        color: colors.blurple
    });


	let a = await ctx.reply({ embeds: [embed], components: [row] });

    infostuffs.push(a.id, clan);
    setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command("disband", data);
