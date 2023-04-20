const { random } = require('stews');

class ID {
    constructor() {
        let id = [];
		let chars = "abcdefghijklmnopqrstuvwxyz1234567890".split("");

		for (let i = 0; i < 4; i++) {
			id.push(random.choice(chars));
		}

        return id;
    }
}

module.exports = { ID };
