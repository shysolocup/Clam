var { psc, bot } = require('../../../../index.js');
var { colors, emojis } = require('../../../assets/index.js');
var { Clanner, Catch } = require('../../../classes/index.js');
var { vary } = require('../../../stuff.js');
const { Soup } = require('stews');

var parts = require('./parts');

async function data(ctx, cmd) {
	let disabled = !(psc.author.hasPermissions(["admin"]) || isDev(ctx.author.id));
    if ( Catch( disabled, { post: false }) ) return;


    let part = cmd.args[0];
    cmd.args.shift();

    if ( 
        Catch( !part, { text: "Please put a command to force." }) ||
        Catch( !parts.parts.includes(part), { text: "Please put a valid command to force" })
    ) return;


    return parts[part](ctx, cmd);
}


module.exports = { data };
