const { Soup } = require('stews');

class Shout {
    constructor(content, author, timestamp) {
        return new Soup({
            content: content,
            author: author,
			timestamp: timestamp
        });
    }
}

module.exports = { Shout };
