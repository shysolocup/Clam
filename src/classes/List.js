const { Soup } = require('stews');

class List {
    constructor(per, object) {
        var obj = Soup.from(object);

        var list = new Soup({
            pages: 1,
            total: 0,
            content: new Soup([ [] ]),

            get(page) {
                return this.content[page+1];
            }
        });

        var page = 0;
        var count = 0;

        for (let i = 0; i < obj.length; i++) {
                if (!list.content.get(page+1) && count >= per) { page += 1; list.pages += 1; list.content.push( [] ); count = 0; }

                list.content[page].push( (obj.isPair()) ? obj.entries[i] : obj[i] );

                list.total += 1;
                count += 1;
       
        }

        return list;
    }
}


module.exports = { List };
