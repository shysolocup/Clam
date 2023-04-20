var { psc, bot } = require('../../index.js');
var { colors, acceptEmoji } = require('../assets');
var { Clanner } = require('../classes');

async function data(ctx, cmd) {
	let clans = new Clanner();
	let id = cmd.args[0];

	console.log(clans.fetch(id, ctx.guild.id));
}

psc.command("get", data);
