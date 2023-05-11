var { psc, bot } = require('../../index.js');
var { colors, emojis, infostuffs } = require('../assets');
var { Clanner, Catch } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	let clans = new Clanner();
	let [ id, userID ] = cmd.args;
  
  let user = await psc.fetchUser(userID);
	
    
    /* handling */
    if (
        Catch( cmd.onCooldown, { 
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		}) ||

    	Catch( !id, { text: 'Please put a clan ID.' }) ||
        Catch( !userID, { text: 'Please put a user.' }) ||
        Catch( !user, { text: "Please put a valid user." }) ||
        Catch( !clans.has(id, ctx.guild.id), { text: "There is no clan with that ID." })
    ) return;


	var clan = clans.fetch(id);
	
	
	if (
        Catch( ctx.author.id != clan.owner, { post: false }) ||
        Catch( !clan.members.includes(user.id), { text: "You can only transfer ownership to someone in the clan." })
    ) return;
	
    
    /* buttons n stuff */
    let transferAccept = new psc.Button({ id: "transferAccept", label: "Yes", style: "success"});
    let transferDecline = new psc.Button({ id: "transferDecline", label: "No", style: "danger"});

    let row = new psc.ActionRow([transferAccept, transferDecline]);


    /* embed stuff */
    let embed = new psc.Embed({
        title: `Owner Transferring  👑`,
        description: `Are you sure you would like to give ownership of ${"`"+clan.name+"`"} to <@${user.id}>`,

        footer: `( id: ${clan.id} )`,

        color: colors.blurple
    });


	let a = await ctx.reply({ embeds: [embed], components: [row] }).catch(e=>{});

    infostuffs.push(a.id, [user, clan] );
    setTimeout(() => infostuffs.delete(a.id), 21600000);
}

psc.command("transfer", data);
