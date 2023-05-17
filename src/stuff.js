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


function vary(thing, obj) {
    var stuff = [];
	
	if (obj[thing]) {
        stuff.push( obj[thing] );
	}
    else if (obj[thing.constructor.name]) {
        stuff.push( obj[thing.constructor.name] );
    }
    else if (obj[typeof thing]) {
        stuff.push( obj[typeof thing] );
    }
	else if (obj["default"]) {
		stuff.push( obj["default"] );
	}
	
    stuff.push(thing);
	
    return (stuff[0] instanceof Function) ? stuff[0].bind(stuff[1])() : stuff[0];
}


module.exports = { ID, vary };
