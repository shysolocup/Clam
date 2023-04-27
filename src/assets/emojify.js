function emojify(category) {
	return { "general": "👥", "management": "🛠️", "moderation": "🛡️", "economy": "💰", "administrator": "🔓"}[category.toLowerCase()];
}

module.exports = { emojify };
