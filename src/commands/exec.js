/* THIS IS A DEBUGGING COMMAND AND I ONLY ADVISE USING IT IF YOU KNOW WHAT YOU'RE DOING WITH THE BOT INTERNALLY */

var { psc, bot } = require('../../index.js');
var { pearl, pearlify, colors, colorify, emojis, infostuffs, isDev } = require('../assets');
var { Catch } = require('../classes');

const { Soup } = require('stews');


var importParts = new Soup({
	catch: require('../classes').Catch,
	classes: require('../classes'),
	assets: require('../assets'),
	data: require('../data'),
	index: require('../../index.js'),
	fetchChannel: require('../../index.js').psc.fetchChannel,
	fetchGuild: require('../../index.js').psc.fetchGuild,
	fetchUser: require('../../index.js').psc.fetchUser,
	fetchMessage: require('../../index.js').psc.fetchMessage,
	fetchReply: require('../../index.js').psc.fetchReply,
	fetchMember: require('../../index.js').psc.fetchUser,
	fetchRole: require('../../index.js').psc.fetchRole,
	fetchGuildChannel: require('../../index.js').psc.fetchGuildChannel,
	fetchGuildUser: require('../../index.js').psc.fetchGuildUser,
	fetchGuildMember: require('../../index.js').psc.fetchGuildUser,
	fetchGuildRole: require('../../index.js').psc.fetchGuildRole,
	time: require('../../index.js').psc.time,
	embed: require('../../index.js').psc.Embed,
	button: require('../../index.js').psc.Button,
	selection: require('../../index.js').psc.Selection,
	selectMenu: require('../../index.js').psc.SelectMenu,
	actionRow: require('../../index.js').psc.ActionRow,
	colors: require('../assets').colors,
	clans: new (require('../classes').Clanner),
	economy: new (require('../classes').Econner),
	random: require('stews').random
});

async function data(ctx, cmd) {

	var code = cmd.args.join(" ");
	
	/* handling */
	if (
		Catch( !isDev(ctx.author.id), { post: false }) ||

		Catch( cmd.onCooldown, {
			head: `Woah there!  :face_with_spiral_eyes:`,
			text: `You can use this command again ${ cmd.cooldown.relative }`,
			time: cmd.cooldown.time
		}) ||

		Catch( !code.startsWith("```js") || !code.endsWith("```"), { text: "You have to put code for it to execute like this:\n` ```js\nput your code here\n``` `" })
	) { return }

	function eh(e) {
		return ctx.reply(e.message).catch((e)=>{});
	}
	

	var commandParts = new Soup({
		command: cmd,
		cmd: cmd,
		guild: ctx.guild,
		channel: ctx.channel,
		author: ctx.author,
		attachments: ctx.attachments,
		components: ctx.components,
		stickers: ctx.stickers,
		reactions: ctx.reactions,
		embeds: ctx.embeds,
		content: ctx.content,
		id: ctx.id,
		arguments: cmd.args,
		cooldown: cmd.cooldown,
		onCooldown: cmd.onCooldown,
		reply() {  return ctx.reply(...arguments).catch(eh)  },
		PSCReply() {  return psc.reply(...arguments).catch(eh)  },
		send() { return ctx.channel.send(...arguments).catch(eh)  },
		PSCSend() {  return psc.send(...arguments).catch(eh)  },
	});

	var parts = importParts.merge(commandParts);

	const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

	try {
		code = new AsyncFunction(Soup.from(code, "```")[1].replace("js", ""));
	}
	catch(e) { return ctx.reply(e.message).catch((e)=>{}); }

	try {
		let stuff = await code.bind(parts)();
	}
	catch(e) { return ctx.reply(e.message).catch((e)=>{}); }

	psc.reply("Done!", { deleteAfter: "3s" });
}

psc.command({ name: "exec", aliases: ["command", "run", "cmd", "test", "execute"] }, data);
