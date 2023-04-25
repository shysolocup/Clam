var { psc, bot } = require('../../index.js');
var { infostuffs } = require('../assets');

async function data(ctx) {
	if (infostuffs.has(ctx.id)) infostuffs.delete(ctx.id);
}

psc.event("messageDelete", data);
