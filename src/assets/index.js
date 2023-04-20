var { psc } = require('../../index.js');
let colors = psc.colors;

colors.accept = "#57F287";
colors.decline = "#ED4245";

function pearlify(amount) {
	return Intl.NumberFormat().format(Math.round(funds*100)/100);
}

function colorify(amount) {
	balance = parseInt(`${balance}`.split(",").join(""));
	var col = (balance >= 999999999999999) ? [0xFF523A, 11] :
		(balance >= 10000000000000) ? [0xFFFFFF, 10] :
		(balance >= 1000000000000) ? [0xf1c40f, 9] :
		(balance >= 100000000000) ? [0x95a5a6, 8] :
		(balance >= 10000000000) ? [0xCD7F32, 7] :
		(balance >= 1000000000) ? [0x9b59b6, 6] :
		(balance >= 500000000) ? [0x2F99E3, 5] :
		(balance >= 10000000) ? [0x2ecc71, 4] :
		(balance >= 5000000) ? [0x206694, 3] :
		(balance == 800813) ? [0xB00B1E, 800813] :
		(balance >= 100000) ? [0x1f8b4c, 2] :
		(balance >= 1000) ? [0x11806a, 1] :
		(balance <= -999999999999999) ? [0xFFEC67, 999999999999999] :
		(balance < 0) ? [0x546e7a, 5] :
		(balance < 1000) ? [0x99aab5, 0] :
		[0x000000, -1];
		
		/*
		(userBal >= 999999999999) ? [0xFF523A, 10] : [0x852C34, 11]
  		*/
  		
	return col;
}

let stuff = {
	pearl: "🔘",
	pearlify: pearlify,
	
	colors: colors,
	colorify: colorify,
	
	acceptEmoji: "<:confirm:1052011206891798618>",
	declineEmoji: "<:decline:1052011672774131762>",
	goldEmoji: "<:goldenclam:1052759240885940264>",
};

module.exports = { ...stuff  };
