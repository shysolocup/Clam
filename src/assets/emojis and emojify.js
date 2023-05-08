let emojis = {
	success: "<:confirm:1052011206891798618>",
	fail: "<:decline:1052011672774131762>",
	gold: "<:goldenclam:1052759240885940264>",
	
	slots: [
		":fist:",
		":v:",
		":raised_hand:"
	],

	uslots: [
		":heart_hands:",
		":palms_stuck_together:",
		":open_hands:",
		":raised_hands:",
		":clap:",
		":handshake:",
		":thumbsup:",
		":thumbsdown:",
		":punch:",
		":fist:",
		":left_facing_fist:",
		":right_facing_fist:",
		":fingers_crossed:",
		":v:",
		":hand_with_index_finger_and_thumb_crossed:",
		":love_you_gesture:",
		":metal:",
		":ok_hand:",
		":pinched_fingers:",
		":pinching_hand:",
		":palm_down_hand:",
		":palm_up_hand:",
		":point_left:",
		":point_right:",
		":point_up_2:",
		":point_down:",
		":point_up:",
		":raised_hand:",
		":raised_back_of_hand:",
		":hand_splayed:",
		":vulcan:",
		":wave:",
		":call_me:",
		":leftwards_hand:",
		":rightwards_hand:",
		":middle_finger:",
		":writing_hand:",
		":pray:",
		":index_pointing_at_the_viewer:",
		":foot:"
	]
};

function emojify(category) {
	return { "general": "👥", "management": "🛠️", "moderation": "🛡️", "economy": "💰", "administrator": "🔓"}[category.toLowerCase()];
}

module.exports = { emojis, emojify };
