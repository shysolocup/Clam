const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { promises } = require('fs');
const { join } = require('path');
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
        Catch( !clans.has(id, ctx.guild.id) && !clans.has(attr, ctx.guild.id), { text: "There is no clan with that ID." }) ||


        Catch( function() {
            if (clans.has(id, ctx.guild.id)) {
                let clan = clans.fetch(id);

                return !clan.ops.includes(ctx.author.id) && ctx.author.id != clan.owner;
            }
            else if (clans.has(attr, ctx.guild.id)) {
                let clan = clans.fetch(attr);

                return !clan.ops.includes(ctx.author.id) && ctx.author.id != clan.owner;
            }
        }(),
        { text: "Only operators of the clan can edit attributes."}) ||


        Catch( !attr, { text: 'Please put an attribute to set.' }) ||
        Catch( !clans.canSet(attr) && !clans.canSet(id), { text: "That is not an attribute you can set."}) ||
        Catch( !id, { text: 'Please put a clan ID.' }) ||
        Catch(
            
            value=="" && // no value
            !["private", "public", "unlisted"].includes(id.toLowerCase()) && // not a status
            ctx.attachments.size <= 0, // no attachments

            { text: 'Please put a value.' }

        )

    ) return;


    /* embed stuff */
    var rawEmbed = {
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

    // shout
    else if (attr.toLowerCase() == "shout") {
        clans.shout(id, value, ctx.author.id);
        rawEmbed.description = `${emojis.success} Set clan shout to`;
        rawEmbed.fields = [
            { name:"Shout:", value: `"${value}" - <@${ctx.author.id}>` , inline: false},
            { name:"** **", value: "** **", inline: false}
        ];
    }

    // color
    else if (attr.toLowerCase() == "color") {
        var color;

        if (Soup.from(colors).includes(value.toLowerCase())) color = colors[value.toLowerCase()];

        else {
            if ( Catch( !value.startsWith("#") && value.toLowerCase() != "rank", { text: "Color must be a hex color or rank: `#FFFFFF or rank`"}) ) return;
            color = value.toLowerCase();
        }

        clans.set(id, "color", color);
        rawEmbed.description = `${emojis.success} Set clan color to ${"`"+color.toUpperCase()+"`"}`;
    }

    // status
    else if ( attr.toLowerCase() == "status" || ["private", "public", "unlisted"].includes(id.toLowerCase()) ) {
        if (["private", "public", "unlisted"].includes(id.toLowerCase())) {
            clans.set(attr, "status", clans.intStatus(id.toLowerCase()));

            rawEmbed.description = `${emojis.success} Set clan status to ${clans.status(clans.intStatus(id.toLowerCase()))}`;
            rawEmbed.footer = `( id: ${attr} )`;
        }
        else {
            clans.set(id, "status", clans.intStatus(value.toLowerCase()));

            rawEmbed.description = `${emojis.success} Set clan status to ${clans.status(clans.intStatus(value.toLowerCase()))}`;
            rawEmbed.footer = `( id: ${id} )`;
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
            
            const canvas = Canvas.createCanvas(500, 500);
            const context = canvas.getContext('2d');

            var imageURL = attachments[0];
            let image = await Canvas.loadImage(imageURL);

            context.drawImage(image, 0, 0, 500, 500);

            let attachment = new AttachmentBuilder(await canvas.encode("png"), { name: `clan-${attr.toLowerCase()}.png` });

            rawEmbed.image = `attachment://${attachment.name}`;

            let embed = new psc.Embed(rawEmbed);

            /*
            clans.set(id, attr.toLowerCase(), image);

            rawEmbed.description = `${emojis.success} Set clan ${attr.toLowerCase()} to`;
            rawEmbed.image = image;
            */
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
