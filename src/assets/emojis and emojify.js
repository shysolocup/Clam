let emojis = {
	accept: "<:confirm:1052011206891798618>",
	decline: "<:decline:1052011672774131762>",
	gold: "<:goldenclam:1052759240885940264>"
};

function emojify(category) {
	return { "general": "👥", "management": "🛠️", "moderation": "🛡️", "economy": "💰", "administrator": "🔓"}[category.toLowerCase()];
}

module.exports = { emojis, emojify };
