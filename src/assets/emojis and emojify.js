let acceptEmoji = "<:confirm:1052011206891798618>";
let declineEmoji = "<:decline:1052011672774131762>";
let goldEmoji = "<:goldenclam:1052759240885940264>";

function emojify(category) {
	return { "general": "👥", "management": "🛠️", "moderation": "🛡️", "economy": "💰", "administrator": "🔓"}[category.toLowerCase()];
}

module.exports = { acceptEmoji, declineEmoji, goldEmoji, emojify };
