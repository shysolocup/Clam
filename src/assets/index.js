var { psc } = require('../../index.js');
let colors = psc.colors;

colors["accept"] = "#57F287";
colors["decline"] = "#ED4245";

let stuff = {
	pearl: "🔘",
	acceptEmoji: "<:confirm:1052011206891798618>",
	declineEmoji: "<:decline:1052011672774131762>",
	colors: colors
};
module.exports = { ...stuff  };
