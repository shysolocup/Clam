var { psc } = require('../../index.js');
const { Soup } = require('stews');
let colors = psc.colors;

colors.accept = "#57F287";
colors.decline = "#ED4245";

var infostuffs = new Soup(Object);

function pearlify(balance) {
	return Intl.NumberFormat().format(Math.round(balance*100)/100);
}

function colorify(balance) {
	balance = parseInt(`${balance}`.split(",").join(""));
	var col = (balance >= 999999999999999) ? ["#FF523A", 11] :
		(balance >= 10000000000000) ? ["#FFFFFF", 10] :
		(balance >= 1000000000000) ? ["#f1c40f", 9] :
		(balance >= 100000000000) ? ["#95a5a6", 8] :
		(balance >= 10000000000) ? ["#CD7F32", 7] :
		(balance >= 1000000000) ? ["#9b59b6", 6] :
		(balance >= 500000000) ? ["#2F99E3", 5] :
		(balance >= 10000000) ? ["#2ecc71", 4] :
		(balance >= 5000000) ? ["#206694", 3] :
		(balance == 800813) ? ["#B00B1E", 800813] :
		(balance >= 100000) ? ["#1f8b4c", 2] :
		(balance >= 1000) ? ["#11806a", 1] :
		(balance <= -999999999999999) ? ["#FFEC67", 999999999999999] :
		(balance < 0) ? ["#546e7a", 5] :
		(balance < 1000) ? ["#99aab5", 0] :
		["#000000", -1];
		
		/*
		(userBal >= 999999999999) ? ["#FF523A", 10] : ["#852C34", 11]
  		*/
  		
	return col;
}


let stuff = {
	infostuffs: infostuffs,
	
	pearl: "🔘",
	pearlify: pearlify,
	
	colors: colors,
	colorify: colorify,
	
	acceptEmoji: "<:confirm:1052011206891798618>",
	declineEmoji: "<:decline:1052011672774131762>",
	goldEmoji: "<:goldenclam:1052759240885940264>",
};


module.exports = { ...stuff  };
