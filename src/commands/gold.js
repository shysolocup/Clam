var { psc, bot } = require('../../index.js');
var { colors, emojis, isDev } = require('../assets');
var { Catch, Clanner } = require('../classes');

const { Soup } = require('stews');


async function data(ctx, cmd) {
    let clans = new Clanner();


    /* handling */
    let disabled = !( psc.author.hasPermissions(["admin"] || isDev(ctx.author.id) ));

	if ( 
        Catch( disabled && cmd.args.length > 0, { post: false }) ||

        Catch( cmd.onCooldown, { 
		    head: `Woah there!  :face_with_spiral_eyes:`,
		    text: `You've been timed out from using this command for a bit.`
	    })
        
    ) return;
    

    let [id, bool] = cmd.args;


    if ( 
        Catch( !id, { text: "Please put a clan ID."}) ||
        Catch( !clans.has(id), { text: "There is no clan with that ID."}) 
    ) return;


    let clan = clans.fetch(id);


    var embed;

    if (bool) {
        if ( ["true", "on"].includes(bool.toLowerCase()) ) bool = true;
        else if ( ["false", "off"].includes(bool.toLowerCase()) ) bool = false;
        else return Catch( true, { text: "Please put true or false for the value." });

        embed = new psc.Embed({
            description: `${emojis.success} ${ (bool) ? "Gave" : "Removed" } ${clan.name}${ (bool) ? "" : "'s" } gold`,
            footer: `( id: ${clan.id} )`,
            color: colors.success
        });

        clans.set(id, "gold", bool);
    }
    else {
        embed = new psc.Embed({
            description: `Gold for ${clan.name} is ${"`"+clan.gold+"`"}`,
            footer: `( id: ${clan.id} )`,
            color: colors.blurple
        });
    }

    ctx.reply({ embeds: [embed] });
}

psc.command({ name: "gold", cooldown: "5s"}, data);
