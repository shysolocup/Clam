var { psc, bot } = require('../../../../../index.js');
var { colors, emojis } = require('../../../../assets');

const { Soup } = require('stews');


async function data(ctx, cmd) {
	const { Clanner, Catch } = require('../../../../classes');
	
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You can use this command again ${ cmd.cooldown.relative }`,
		time: cmd.cooldown.time
	}) ) return;


    let args = Soup.from(cmd.args);

    if ( Catch( !args[0], { text: 'Please put a clan ID.'})) return
	
	var id = args[0];
    args.shift();
    var content = args.join(" ");


	var clans = new Clanner();


	/* handling */
	if (
		Catch( !id, { text: 'Please put a clan ID.' }) ||
        Catch( !clans.has(id, ctx.guild.id), { text: 'There is no clan with that ID.'}) ||
        Catch( !content, { text: "Please put the shout's content." })
	) return;
	

	let clan = clans.fetch(id);

	
	const embed = new psc.Embed({
		description: `${emojis.success}  Set the clan shout:`,

        fields: [
            { name:"Shout:", value: `"${content}" - <@${ctx.author.id}> ${psc.time.now.relative}` , inline: false},
            { name:"** **", value: "** **", inline: false}
        ],

		footer: `( id: ${clan.id} )`,
		color: colors.success
	});

	ctx.reply({ embeds: [embed] }).catch(e=>{});
	clans.shout(clan.id, content, ctx.author.id, psc.time.now.relative, ctx.guild.id);
}


module.exports = {
    name: "shout",
    data: data
};
