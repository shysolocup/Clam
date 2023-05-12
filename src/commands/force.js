/* THIS IS A DEV/ADMIN ONLY COMMAND AND THUS ONLY SHOWS UP IN THE LOCKED ADMINISTRATOR SECTION */
/* IT ALSO USES INSIDES SO THAT IT CAN BE BETTER ORGANIZED BECAUSE IT COVERS MULTIPLE COMMANDS IN ONE */

var { psc, bot } = require('../../index.js');
var { data } = require('./insides/force');


psc.command("force", data);
