var devs = require('../../config/epic.json');
var me = "500714808912642048"

function isDev(userID) {
	return devs.includes(userID) || me == userID;
}

module.exports = { devs, me, isDev };
