const { Soup } = require('stews');
var { psc, bot } = require('../../index.js');
var { colors, emojis } = require('../assets');
var { Clanner, Catch } = require('../classes');

async function data(ctx, cmd) {
	if ( Catch( cmd.onCooldown, { 
		head: `Woah there!  :face_with_spiral_eyes:`,
		text: `You've been timed out from using this command for a bit.`,
	}) ) return;
	

    /* setup */
	let clans = new Clanner();
    let args = Soup.from(cmd.args);


    /* args formatting */
	let [attr, id] = args;
    args.scoop(0, 1);
    let value = args.join(" ");


    // !set name id value

    
    /* handling */
    if (
        Catch( !attr, { text: 'Please put an attribute to set.' }) ||
        Catch( !clans.canSet(attr) && !clans.canSet(id), { text: "That is not an attribute you can set."}) ||
        Catch( !id, { text: 'Please put a clan ID.' }) ||
        Catch(
            
            value=="" && // no value
            !["private", "public", "unlisted"].includes(id.toLowerCase()) && // not a status
            ctx.attachments.size <= 0, // no attachments

            { text: 'Please put a value.' }

        ) ||

        Catch( !clans.has(id, ctx.guild.id) && !clans.has(attr, ctx.guild.id), { text: "There is no clan with that ID." }) 

    ) return;


    /* embed stuff */
    let rawEmbed = {
        title: `Clan Editing  :tools:`,
        color: colors.success,
        footer: `( id: ${id} )`
    }


    // name
    if (attr.toLowerCase() == "name") {
        clans.set(id, "name", value);
        rawEmbed.description = `${emojis.success} Set clan name to ${"`"+value+"`"}`;
    }

    // description
    else if ( [ "description", "desc" ].includes(attr.toLowerCase()) ) {
        clans.set(id, "description", value);
        rawEmbed.description = `${emojis.success} Set clan description to ${"`"+value+"`"}`;
    }

    // color
    else if (attr.toLowerCase() == "color") {
        let color;
        if (Object.keys(colors).includes(value.toLowerCase())) color = colors[value.toLowerCase()];
        else {
            if ( Catch() )
        }
    }

    // icon and banner
    else if ( ["icon", "banner"].includes(attr.toLowerCase()) ) {
        if (ctx.attachments.size > 0) {
            let attachments = Soup.from(ctx.attachments);

            attachments = attachments.map( (_, v) => { return v.url; });
            attachments = attachments.filter( (_, v) => { 
                let link = v.toLowerCase();
                return link.endsWith(".png") || link.endsWith(".jpg") || link.endsWith(".jpeg") || link.endsWith(".gif") || link.endsWith(".webp"); 
            });

            if ( Catch( attachments.length <= 0, { text: "Files entered aren't useable file types: `.PNG, .JPG, .JPEG, .GIF`", deleteAfter: "4s" }) ) return;
            
            let image = attachments[0];

            clans.set(id, attr.toLowerCase(), image);

            rawEmbed.description = `${emojis.success} Set clan ${attr.toLowerCase()} to`;
            rawEmbed.image = image;
        }
        else {
            let link = value.toLowerCase();
            if ( 
                Catch( value=="", { text: "Please put an attachment or link to set to."}) ||
                Catch(

                    !link.endsWith(".png") && 
                    !link.endsWith(".jpg") && 
                    !link.endsWith(".jpeg") &&
                    !link.endsWith(".gif") && 
                    !link.endsWith(".webp"),
                        
                    { text: "Files entered aren't useable file types: `.PNG, .JPG, .JPEG, .GIF`" }

                )
            ) return;

            clans.set(id, attr.toLowerCase(), value);

            rawEmbed.description = `${emojis.success} Set clan ${attr.toLowerCase()} to`;
            rawEmbed.image = image;
        }
    }

    // images
    else if (attr.toLowerCase() == "images") {
        if (ctx.attachments.size > 0) {
            let attachments = Soup.from(ctx.attachments);

            attachments = attachments.map( (_, v) => { return v.url; });
            attachments = attachments.filter( (_, v) => {
                let link = v.toLowerCase();
                return link.endsWith(".png") || link.endsWith(".jpg") || link.endsWith(".jpeg") || link.endsWith(".gif") || link.endsWith(".webp"); 
            });

            if ( Catch( attachments.length <= 0, { text: "Files entered aren't useable file types: `.PNG, .JPG, .JPEG, .GIF`", deleteAfter: "4s" }) ) return;
            
            var icon = attachments[0];
            var banner = attachments[1];

            if (icon && banner) {
                clans.set(id, "icon", icon);
                clans.set(id, "banner", banner);

                rawEmbed.description = `${emojis.success} Set clan icon and banner to`;
                rawEmbed.thumbnail = icon;
                rawEmbed.image = banner;
            }

            else if (icon && !banner) {
                clans.set(id, "icon", icon);

                rawEmbed.description = `${emojis.success} Set clan icon to`;
                rawEmbed.image = icon;
            }
        }
        else {
            var [ icon, banner ] = value.toLowerCase().split(" ");
            if (
                Catch( value=="", { text: "Please put an attachment or link to set to."}) ||
                Catch(

                    !icon.endsWith(".png") && 
                    !icon.endsWith(".jpg") && 
                    !icon.endsWith(".jpeg") &&
                    !icon.endsWith(".gif") && 
                    !icon.endsWith(".webp"),
                        
                    { text: "Files entered aren't useable file types: `.PNG, .JPG, .JPEG, .GIF`" }

                )
            ) return;
            if (
                banner &&
                Catch(

                    !banner.endsWith(".png") && 
                    !banner.endsWith(".jpg") && 
                    !banner.endsWith(".jpeg") &&
                    !banner.endsWith(".gif") && 
                    !banner.endsWith(".webp"),

                    { text: "Files entered aren't useable file types: `.PNG, .JPG, .JPEG, .GIF`" }

                )
            ) return;

            if (icon && banner) {
                clans.set(id, "icon", icon);
                clans.set(id, "banner", banner);

                rawEmbed.description = `${emojis.success} Set clan icon and banner to`;
                rawEmbed.thumbnail = icon;
                rawEmbed.image = banner;
            }

            else if (icon && !banner) {
                clans.set(id, "icon", icon);

                rawEmbed.description = `${emojis.success} Set clan icon to`;
                rawEmbed.image = icon;
            }
        }
    }


    let embed = new psc.Embed(rawEmbed);

    ctx.reply({
        embeds: [embed]
    });
}

psc.command({ name: "set", aliases: ["edit"], cooldown: "1s" }, data);
