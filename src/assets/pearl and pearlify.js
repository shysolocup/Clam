function pearlify(balance) {
	return Intl.NumberFormat().format(Math.round(balance*100)/100);
}

var pearl = "🔘";

module.exports = { pearl, pearlify };
