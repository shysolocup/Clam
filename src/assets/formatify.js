const { Soup } = require('stews');

function formatify(amount) {
	amount = Soup.from(amount).replaceAll(",", "").join("");
	amount = Soup.from(amount.toLowerCase()).replaceAll("k", "000").join("");
	amount = Soup.from(amount.toLowerCase()).replaceAll("m", "000000").join("");
	
	return amount;
}

module.exports = { formatify };
