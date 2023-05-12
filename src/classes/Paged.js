const { Soup } = require('stews');

class Paged {
    constructor(per, object) {
        var obj = Soup.from(object);

        var paged = new Soup({
            pages: 1,
            total: 0,
            contents: new Soup([ (obj.isPair()) ? Soup.from(Object) : Soup.from(Array) ]),

            page(page) {
                return this.contents[page-1];
            }
        });


        var page = 0;
        var count = 0;


        for (let i = 0; i < obj.length; i++) {
                if (!paged.contents.get(page+1) && count >= per) { 
                    page += 1; 
                    paged.pages += 1; 

                    paged.contents.push( (obj.isPair()) ? Soup.from(Object) : Soup.from(Array) ); 
                    
                    count = 0;
                }


                if (obj.isPair()) paged.contents[page].push( ...obj.entries[i] );
                else paged.contents[page].push( obj[i] );

                paged.total += 1;
                count += 1;
       
        }

        return paged;
    }
}

module.exports = { Paged };
