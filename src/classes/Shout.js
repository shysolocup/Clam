const { Soup } = require('stews');

class Shout {
    constructor(content, author) {
        return new Soup({
            content: content,
            author: author
        });
    }
}

module.exports = { Shout };
