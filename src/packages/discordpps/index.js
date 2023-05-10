/* :: Discord+PS :: Version 0.6.0 | 05/10/23 :: */

/* :: Created by nutmeg using :: *//*
	- Stews: https://github.com/nuttmegg/stews
	- NutFL: https://github.com/nuttmegg/nutfl
*/

const { ActivityType } = require('discord.js');
const voice = require('@discordjs/voice');
const { Stew, Soup, random } = require('stews');


String.prototype.colorFormat = function() {
	if (this.startsWith("#")) { var a = this.replace("#", "0x"); return parseInt(a); } else { return 0x5865F2; }
};

Object.defineProperty(String.prototype, "block", {
	get() { return "`"+this+"`" }, set(){}
});

Object.defineProperty(String.prototype, "bold", {
	get() { return `**${this}**`; }, set(){}
});

Object.defineProperty(String.prototype, "linethrough", {
	get() { return `~~${this}~~`; }, set(){}
});

Object.defineProperty(String.prototype, "bold", {
	get() { return `**${this}**`; }, set(){}
});

Object.defineProperty(String.prototype, "spoiler", {
	get() { return `||${this}||`; }, set(){}
});

String.prototype.codeBlock = function(language=null) {
	return (language) ? "```"+language+"\n"+this+"```" : "```"+this+"```";
};

class CoolError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}

var Holder;

class PSClient {
    constructor(settings) {this.client=settings.client; this.prefix=settings.prefix}
	
    /* configurations */
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    
    setClient(client) {
        this.client = client;
    }
    
    
    /* variables */
    commandList = new Stew(Object);
	handlerActive = false;
	
	globalCooldown = {
		data: new Set(),
    	active: true,
    	time: 0,
    	
    	handle: function(user=null) {
			var [psc, client, ctx] = Holder;

			user = (user) ? user : ctx.author;
					
        	if (!this.data.has(user.id)) {
            	this.data.add(user.id);
            	
            	setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        	}
    	},
    	
    	fetch: function(user=null) {
			var [psc, client, ctx] = Holder;
			return (this.data.has( (user) ? user.id : ctx.author.id )) ? true : false;
    	}
	};
	
	setCooldown(time) {
		time = this.time.parse(time);

		if (typeof time != "number") {
			throw new CoolError("Global Cooldown", "Cooldown has to be an integer (seconds)");
		}

		var raw = Math.abs( this.time.parse(time)*1000 + (Date.now()) );
		var relative = this.time.set.relative(raw);

		this.globalCooldown.time = time
		this.globalCooldown.timestamp = this.time.set.relative( Math.abs(this.time.parse(time)*1000 + (Date.now())) );
		this.globalCooldown.active = true;
		this.globalCooldown.raw = raw;
		this.globalCooldown.relative = relative;
	}
	
	deleteCooldown() {
		this.globalCooldown.active = false;
	}
    
    
    /* commands */
    command(info={name:null, aliases:null, cooldown:null}, data) {
		if (!this.handlerActive) { this.handlerActive = true; ClientHandler(this, this.client); }

		if (typeof info == "string") {
			let thing = info;
			info = { name: thing, aliases: null, cooldown: null};
		}
		
		var [name, aliases] = [info.name, info.aliases];

		var raw = Math.abs( this.time.parse(info.cooldown)*1000 + (Date.now()) )
		var relative = this.time.set.relative(raw);
		
		if (info.cooldown && typeof info.cooldown == "number") { var time = info.cooldown; }
		else if (info.cooldown && typeof info.cooldown == "string") { var time = this.time.parse(info.cooldown); }
		else if (info.cooldown) { throw new CoolError("Command Creation", 'Invalid cooldown. ( cooldown: 3 | cooldown: "3s" )'); }
		
		if (!name || typeof name != "string" || name.length <= 0) {
			throw new CoolError("Command Creation", "Invalid command name.\n\nPossible reasons:\n    • doesn't exist\n    • not a string\n    • blank string\n\nActual error stuff:");
		}
		if (this.commandExists(name)) {
			throw new CoolError("Command Creation", "Command with that name already exists.");
		}
		if (info.cooldown) {
			if (typeof time != "number") {
				throw new CoolError("Command Creation", "Cooldown has to be an integer (seconds)");
			}
			info.cooldown = {
    			data: new Set(),
    			active: true,
    			time: time,
				relative: relative,
				raw: raw,
    			
    			handle: function(user=null) {
					var [psc, client, ctx] = Holder;

					user = (user) ? user : ctx.author;
					
        			if (!this.data.has(user.id)) {
            			this.data.add(user.id);
            			
            			setTimeout( () => { this.data.delete(user.id); }, this.time*1000);
        			}
    			},
    			
    			fetch: function(user=null) {
					var [psc, client, ctx] = Holder;
					return (this.data.has( (user) ? user.id : ctx.author.id )) ? true : false;
    			}
			};
		}
        let newCMD = {"info": Soup.from(info), "data": data};
        this.commandList.push(info.name, newCMD);
		return newCMD;
    }

	commandExists(name) {
		var exists;
		try {
        	for (let i = 0; i < this.commandList.length; i++) {
        	    let info = this.commandList.get(i).info;
        		if (info.get("name") == name || (info.get("aliases") && info.get("aliases").includes(name)) ) { throw true; }
        	}
        	throw false;
        	
        } catch(has) {
            exists = has;
        }
		
		return exists;
	}
    
    fetchCommand(name, func=null) {
        var index;
        try {
        	for (let i = 0; i < this.commandList.length+1; i++) {
        	    var info = this.commandList.get(i).info;
        		if (info.get("name") == name || (info.get("aliases") && info.get("aliases").includes(name)) ) { throw i; }
        	}
        	throw null;
        	
        } catch(has) {
            if (has == null) throw new CoolError("Command Fetch Error", "Invalid command name.");
            else index = has;
        }
        
        let command = this.commandList.get(index);
		
		let returns = {
			name: command.info.get("name"),
			aliases: command.info.get("aliases"),
			cooldown: command.info.get("cooldown"),
			data: command.data
		};
        
        return (!func) ? returns : func(returns);
    }
    
    fetchCMD(name, func=null) { return this.fetchCommand(name,func); }
    
    executeCommand(name, ctx, cmd) {
		var onCooldown; var cooldown; var cooldownType
    	var command = this.fetchCommand(name);
    	
    	if (command.cooldown && command.cooldown.active) {
			if (command.cooldown.fetch()) {
				cooldown = command.cooldown;
				cooldownType = "commandCooldown";
				onCooldown = true;
			}
			command.cooldown.handle();
    	}
    	else if (this.globalCooldown && this.globalCooldown.active) {
			if (this.globalCooldown.fetch()) {
				cooldown = this.globalCooldown;
				cooldownType = "globalCooldown";
				onCooldown = true;
			}
			this.globalCooldown.handle();
    	}
		else {
			cooldown = {};
			onCooldown = false;
			cooldownType = null;
		}
    	
    	cmd.onCooldown = (onCooldown) ? onCooldown : false;
		cmd.cooldownType = (cooldownType) ? cooldownType : null;
		cmd.cooldown = (cooldown) ? cooldown : {};
    	
    	return command.data(ctx, cmd);
    }
    
    executeCMD(name, ctx, cmd=null) { return this.executeCommand(name, ctx, cmd); }

	commandFormat(string, prefix) {
		let res = {};
		let pos = (prefix)
			? string.toLowerCase().indexOf(prefix.toLowerCase())
		: 0;
		
		res["name"] = (prefix)
			? string.toLowerCase().replace(prefix.toLowerCase(), "").split(" ")[pos]
		: string.toLowerCase().split(" ")[pos];

		let soup = new Soup(string.split(" "));

		delete soup[pos];
		
		res["args"] = soup.pour();
		
		return res;
	}

	commandHandler(ctx) {
		if (ctx.author.bot || ctx.author.id == this.client.user.id) return;
		
		let prefix = (this.prefix instanceof Object && this.prefix[ctx.guild.id] ) ? this.prefix[ctx.guild.id] : (this.prefix instanceof Object) ? this.prefix.default : this.prefix;
		
		if (prefix && (!ctx.content.startsWith(prefix) || (ctx.content.endsWith(prefix) && ctx.content.startsWith(prefix)))) return;
		
		let cmd = this.commandFormat(ctx.content, prefix);
		
		if (this.commandExists(cmd.name)) {
			this.executeCommand(cmd.name, ctx, cmd);
		}
	}
    
    /* events */
    eventList = {
    	"start": "ready",
    	"run": "ready",
    	"login": "ready",
		"ready": "ready",
		"message": "message",
		"newMessage": "messageCreate",
		"send": "messageCreate",
		"join": "guildMemberAdd",
		"joinGuild": "guildMemberAdd",
		"newMember": "guildMemberAdd",
		"memberAdd": "guildMemberAdd",
		"memberJoin": "guildMemberAdd",
		"newCommand": "applicationCommandCreate",
		"commandCreate": "applicationCommandCreate",
		"createCommand": "applicationCommandCreate",
		"commandDelete": "applicationCommandDelete",
		"deleteCommand": "applicationCommandDelete",
		"commandUpdate": "applicationCommandUpdate",
		"updateCommand": "applicationCommandUpdate",
		"commandEdit": "applicationCommandUpdate",
		"editCommand": "applicationCommandUpdate",
		"newChannel": "channelCreate",
		"createChannel": "channelCreate",
		"deleteChannel": "channelDelete",
		"pin": "channelPinsUpdate",
		"newPin": "channelPinsUpdate",
		"pinsUpdate": "channelPinsUpdate",
		"updatePins": "channelPinsUpdate",
		"updateChannel": "channelUpdate",
		"editChannel": "channelUpdate",
		"channelEdit": "channelUpdate",
		"chanelUpdate": "channelUpdate",
		"debug": "debug",
		"warn": "warn",
		"newEmoji": "emojiCreate",
		"deleteEmoji": "emojiDelete",
		"updateEmoji": "emojiUpdate",
		"editEmoji": "emojiUpdate",
		"emojiEdit": "emojiUpdate",
		"error": "error",
		"ban": "guildBanAdd",
		"unban": "guildBanRemove",
		"newGuild": "guildCreate",
		"deleteGuild": "guildDelete",
		"guildUnavailable": "guildUnavailable",
		"updateIntegrations": "guildIntegrationsUpdate",
		"memberAvailable": "guildMemberAvailable",
		"leave": "guildMemberRemove",
		"leaveGuild": "guildMemberRemove",
		"memberRemove": "guildMemberRemove",
		"removeMember": "guildMemberRemove",
		"memberChunk": "guildMemberChunk",
		"updateMember": "guildMemberUpdate",
		"editMember": "guildMemberUpdate",
		"memberEdit": "guildMemberUpdate",
		"memberUpdate": "guildMemberUpdate",
		"updateGuild": "guildUpdate",
		"editGuild": "guildUpdate",
		"guildEdit": "guildUpdate",
		"invite": "inviteCreate",
		"newInvite": "inviteCreate",
		"createInvite": "inviteCreate",
		"deleteInvite": "inviteDelete",
		"deleteMessage": "messageDelete",
		"removeAllReactions": "messageReactionRemoveAll",
		"removeReactionEmoji": "messageReactioRemoveEmoji",
		"bulkDelete": "messageDeleteBulk",
		"deleteBulk": "messageDeleteBulk",
		"purge": "messageDeleteBulk",
		"reaction": "messageReactionAdd",
		"newReaction": "messageReactionAdd",
		"reactionAdd": "messageReactionAdd",
		"createReaction": "messageReactionAdd",
		"reactionCreate": "messageReactionAdd",
		"Addreaction": "messageReactionAdd",
		"removeReaction": "messageReactionRemove",
		"reactionRemove": "messageReactionRemove",
		"updateMessage": "messageUpdate",
		"edit": "messageUpdate",
		"editMessage": "messageUpdate",
		"messageEdit": "messageUpdate",
		"updatePresence": "presenceUpdate",
		"editPresence": "presenceUpdate",
		"presenceEdit": "presenceUpdate",
		"rateLimit": "rateLimit",
		"slowmode": "rateLimit",
		"invalidRequestWarning": "invalidRequestWarning",
		"invalidated": "invalidated",
		"createRole": "roleCreate",
		"newRole": "roleCreate",
		"deleteRole": "roleDelete",
		"updateRole": "roleUpdate",
		"editRole": "roleUpdate",
		"roleEdit": "roleUpdate",
		"newThread": "threadCreate",
		"createThread": "threadCreate",
		"deleteThread": "threadDelete",
		"threadListSync": "threadListSync",
		"threadMemberUpdate": "threadMemberUpdate",
		"threadMembersUpdate": "threadMembersUpdate",
		"updateThread": "threadUpdate",
		"editThread": "threadUpdate",
		"threadEdit": "threadUpdate",
		"typing": "typingStart",
		"updateUser": "userUpdate",
		"editUser": "userUpdate",
		"userEdit": "userUpdate",
		"voiceUpdate": "voiceStateUpdate",
		"updateVoice": "voiceStateUpdate",
		"updateVoiceState": "voiceStateUpdate",
		"updateWebhook": "webhookUpdate",
		"editWebhook": "webhookUpdate",
		"webhookEdit": "webhookUpdate",
		"interaction": "interactionCreate",
		"createInteraction": "interactionCreate",
		"newInteraction": "interactionCreate",
		"shardDisconnect": "shardDisconnect",
		"shardError": "shardError",
		"shardReady": "shardReady",
		"shardReconnecting": "shardReconnecting",
		"shardResume": "shardResume",
		"newStage": "stageInstanceCreate",
		"createStage": "stageInstanceCreate",
		"stageCreate": "stageInstanceCreate",
		"newStageInstance": "stageInstanceCreate",
		"createStageInstance": "stageInstanceCreate",
		"updateStage": "stageInstanceUpdate",
		"stageUpdate": "stageInstanceUpdate",
		"updateStageInstance": "stageInstanceUpdate",
		"editStage": "stageInstanceUpdate",
		"stageEdit": "stageInstanceUpdate",
		"editStageInstance": "stageInstanceUpdate",
		"deleteStage": "stageInstanceDelete",
		"stageDelete": "stageInstanceDelete",
		"deleteStageInstance": "stageInstanceDelete",
		"newSticker": "stickerCreate",
		"createSticker": "stickerCreate",
		"deleteSticker": "stickerDelete",
		"updateSticker": "stickerUpdate",
		"editSticker": "stickerUpdate",
		"stickerEdit": "stickerUpdate",
		"button": "interactionCreate",
		"buttonPress": "interactionCreate",
		"buttonPressed": "interactionCreate",
		"selection": "interactionCreate",
		"select": "interactionCreate",
		"selectMenu": "interactionCreate",
		"submitSelection": "interactionCreate",
		"submitSelectMenu": "interactionCreate",
		"selectSubmit": "interactionCreate",
		"selectMenuSubmit": "interactionCreate",
		"selectionSubmit": "interactionCreate"
	};
    
    event(name, func) {
		let eventName = (Object.keys(this.eventList).includes(name))
			? this.eventList[name]
		: (Object.values(this.eventList).includes(name))
			? name
		: function() { throw new CoolError("psc Event", "Invalid event name.") }();
		
		this.client.on(eventName, (ctx) => {
			if (eventName == "interactionCreate") {
				if (ctx.isButton() && (name == "button" || name == "buttonPress" || name == "buttonPressed")) {
					return func(ctx);
				}
				if (ctx.isSelectMenu() && (name == "selection" || name == "select" || name == "selectMenu" || name == "submitSelection" || name == "submitSelectMenu" || name == "selectSubmit" || name == "selectMenuSubmit" || name == "selectionSubmit")) {
					return func(ctx);
				}
			}
			return func(ctx);
		});
    }
	on(name, func) { return this.event(name, func); }
	action(name, func) { return this.event(name, func); }
	
	buttonAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isButton()) {
				return func(ctx);
			}
		});
	}
	
	selectionAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isStringSelectMenu()) {
				return func(ctx);
			}
		});
	}

	selectMenuAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isStringSelectMenu()) {
				return func(ctx);
			}
		});
	}
	
	rowAction(func) {
		this.client.on("interactionCreate", (ctx) => {
			if (ctx.isButton() || ctx.isStringSelectMenu()) {
				return func(ctx);
			}
		});
	}

	/* embeds */
	colors = {
		white:"#FFFFFF",
		black:'#000000',
		teal:'#1abc9c',
		dark_teal:'#11806a',
		green:'#2ecc71',
		dark_green:'#1f8b4c',
		blue:'#3498db',
		dark_blue:'#206694',
		purple:'#9b59b6',
		dark_purple:'#71368a',
		magenta:'#e91e63',
		dark_magenta:'#ad1457',
		gold:'#f1c40f',
		dark_gold:'#c27c0e',
		orange:'#e67e22',
		dark_orange:'#a84300',
		red:'#e74c3c',
		dark_red:'#992d22',
		lighter_grey:'#95a5a6',
		dark_grey:'#607d8b',
		light_grey:'#979c9f',
		darker_grey:'#546e7a',
		blurple:'#7289da',
		greyple:'#99aab5',
		clam:'#FF523A',
		dynastio:'#852C34',
		boobie:'#B00B1E',
		fish:'#EA7E00',
		water:'#2F99E3',
		nut:"#FFEC67"
	};
	
	colorFormat(hexColor) {
		if (hexColor.startsWith("#")) { var a = hexColor.replace("#", "0x"); return parseInt(a); } else { return 0x5865F2; }
	}
	
	Embed = class {
		constructor(obj) {
			if (obj.color) { obj.color = obj.color.colorFormat(); }
			if (obj.author) {
				if (obj.author.icon) { obj.author.icon_url = obj.author.icon; }
				else if (obj.author.iconURL) { obj.author.icon_url = obj.author.iconURL; }
			}
			if (typeof obj.thumbnail == "string") {
				let thumbnail = obj.thumbnail;
				obj.thumbnail = { url: thumbnail };
			}
			if (obj.fields) {
				let fixFields = [];
				
				obj.fields.forEach( (field) => {
					fixFields.push(field);
					if (field.newline) { fixFields.push({ name:"** **", value: "** **", inline: false}); }
				});
	
				obj.fields = fixFields;
			}
			if (typeof obj.image == "string") {
				let image = obj.image;
				obj.image = { url: image };
			}
			if (obj.timestamp) {
				if (obj.timestamp.toLowerCase() == "current" || obj.timestamp.toLowerCase() == "now") obj.timestamp = new Date().toISOString();
			}
			if (obj.footer) {
				if (typeof obj.footer == "string") {
					let footer = obj.footer;
					obj.footer = { text: footer };
				}
				
				if (obj.footer.name) { obj.footer.text = obj.footer.name; }
				if (obj.footer.icon) { obj.footer.icon_url = obj.footer.icon; }
				else if (obj.footer.iconURL) { obj.footer.icon_url = obj.footer.iconURL; }
			}
			
			return obj;
		}
	}

	buttonStyle(style) {
		return (typeof style == "number")
			? style
		: (style.toLowerCase() == "primary")
			? 1
		: (style.toLowerCase() == "secondary")
			? 2
		: (style.toLowerCase() == "success")
			? 3
		: (style.toLowerCase() == "danger")
			? 4
		: (style.toLowerCase() == "link")
			? 5
		: null;
	}

	ActionRow = class {
		constructor(array) {
			return { type: 1, components: array };
		}
	}
	Row = this.ActionRow;

	Button = class {
		constructor(obj) {
			var [psc] = Holder;
			obj.type = 2;
			if (obj.id) {
				obj.custom_id = obj.id;
			}
			if (obj.style) {
				obj.style = psc.buttonStyle(obj.style);
			}
			
			return obj;
		}
	}

	Selection = class {
		constructor(obj) {
			obj.type = 3;
			if (obj.id) {
				obj.custom_id = obj.id;
			}
			if (obj.label || obj.text) {
				obj.placeholder = (obj.label) ? obj.label : obj.text;
			}
			if (obj.minimum || obj.min) {
				obj.min_values = (obj.minimum) ? obj.minimum : obj.min;
			}
			if (obj.maximum || obj.max) {
				obj.max_values = (obj.maximum) ? obj.maximum : obj.max;
			}
	
			return obj;
		}
	}

	SelectMenu = this.Selection;
	

	/* fetches */
	fetchUser(id) { if (!id) return null; let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = this.client.users.fetch(mention).catch(e=>{}); return (!user) ? null : user; }
	fetchMember(id) { return this.fetchUser(id); }
	
	fetchGuildUser(id, guild=null) { if (!id) return null; var [psc, client, ctx] = Holder; let mention = id; if (mention.startsWith('<@') && mention.endsWith('>')) {mention = mention.slice(2, -1); if (mention.startsWith('!')) {mention = mention.slice(1); }} mention = mention.split("").join(""); let user = (guild) ? guild.members.fetch(mention).catch(e=>{}) : ctx.guild.members.fetch(mention).catch(e=>{}); return (!user) ? null : user; }
	fetchGuildMember(id, guild=null) { return this.fetchGuildUser(id, guild); }
	
	fetchChannel(id) { if (!id) return null; let rawChannel = id; if (rawChannel.startsWith('<#') && rawChannel.endsWith('>')) {rawChannel = rawChannel.slice(2, -1); } rawChannel = rawChannel.split("").join(""); let channel = this.client.channels.fetch(rawChannel).catch(e=>{}); return (!channel) ? null : channel; }

	fetchGuildChannel(id, guild=null) { if (!id) return null; var [psc, client, ctx] = Holder; let rawChannel = id; if (rawChannel.startsWith('<#') && rawChannel.endsWith('>')) {rawChannel = rawChannel.slice(2, -1); } rawChannel = rawChannel.split("").join(""); let channel = (guild) ? guild.channels.fetch(rawChannel).catch(e=>{}) : ctx.guild.channels.fetch(rawChannel).catch(e=>{}); return (!channel) ? null : channel; }

	fetchRole(id, guild=null) { if (!id) return null; var [psc, client, ctx] = Holder; let rawRole = id; if (rawRole.startsWith('<@') && rawRole.endsWith('>')) {rawRole = rawRole.slice(2, -1); if (rawRole.startsWith('&')) {rawRole = rawRole.slice(1); }} rawRole = rawRole.split("").join(""); let role = (guild) ? guild.roles.fetch(rawRole).catch(e=>{}) : ctx.guild.roles.fetch(rawRole).catch(e=>{}); return (!role) ? null : role; }
	fetchGuildRole(id, guild=null) { return this.fetchRole(id, guild); }
	
	fetchGuild(id) { if (!id) return null; let guild = this.client.guilds.fetch(id).catch(e=>{}); return (!guild) ? null : guild; }

	parseEmoji(emoji) { 
		if (!emoji) return null;
		var emojiInfo = {};

		if ((emoji.startsWith("<:") || emoji.startsWith("<a:")) && emoji.endsWith(">")) {
			var animated = (emoji.startsWith("<:") || emoji.startsWith(":")) ? false : true;
			
			emoji = emoji.slice(2, -1);
			
			if (emoji.startsWith(":")) { emoji = emoji.split(""); emoji.shift(); emoji = emoji.join(""); }

			if (emoji.includes(":")) {
				emoji = emoji.split(":");

				emojiInfo.name = emoji[0];
				emojiInfo.id = emoji[1];
			}

			emojiInfo.animated = animated
			emojiInfo.url = `https://cdn.discordapp.com/emojis/${emojiInfo.id}.${ (animated) ? "gif" : "png" }`;

			return emojiInfo;
		}
	}
	
	parseSticker(sticker) {
		if (!sticker) return null;

		let thing = {
			id: sticker.id,
			name: sticker.name,
			description: sticker.description,
			animated: (sticker.format == 2) ? true : false,
			url: `https://cdn.discordapp.com/stickers/${sticker.id}.png`
		};

		return thing;
	}

	
	/* sleeps */
	sleep(time) { return new Promise(resolve => setTimeout(resolve, time*1000)); }
	
	sleepMs(time) { return new Promise(resolve => setTimeout(resolve, time)); }

	
	/* random */
	random = new class {
		number(min, max) {
			return Math.floor(Math.random() * (max - min + 1) ) + min;
		}
		int(min, max) { return this.number(min, max); }

		choice(array) {
			return array[Math.floor(Math.random() * (Number(array.length)))];
		}
	}

	/* time */
	time = new class {
		set = new class {
			embed(date) { return new Date(date).toISOString(); }
			default(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}>` }
			shortTime(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:t>` }
			longTime(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:T>` }
			shortDate(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:d>` }
			longDate(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:D>` }
			shortDT(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:f>` }
			longDT(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:F>` }
			relative(date) { return `<t:${Math.round(new Date(date).getTime() / 1000)}:R>` }
		}
		now = new class {
			get embed() { return new Date().toISOString(); }
			get default() { return `<t:${Math.round(new Date().getTime() / 1000)}>` }
			get shortTime() { return `<t:${Math.round(new Date().getTime() / 1000)}:t>` }
			get longTime() { return `<t:${Math.round(new Date().getTime() / 1000)}:T>` }
			get shortDate() { return `<t:${Math.round(new Date().getTime() / 1000)}:d>` }
			get longDate() { return `<t:${Math.round(new Date().getTime() / 1000)}:D>` }
			get shortDT() { return `<t:${Math.round(new Date().getTime() / 1000)}:f>` }
			get longDT() { return `<t:${Math.round(new Date().getTime() / 1000)}:F>` }
			get relative() { return `<t:${Math.round(new Date().getTime() / 1000)}:R>` }
		}
		parse(string) {
			if (typeof string != "string") {
				return parseFloat(string);
			}
    		let t = string.split("");
    		let thing = t.pop();
    
    		if (thing == "s") { return parseFloat(t.join("")); }
			else if (thing == "ms") { return parseFloat(t.join(""))*1000; }
    		else if (thing == "m") { return parseFloat(t.join(""))*60; }
    		else if (thing == "h") { return parseFloat(t.join(""))*60*60; }
    		else if (thing == "d") { return parseFloat(t.join(""))*60*60*24; }
    		else if (thing == "w") { return parseFloat(t.join(""))*60*60*24*7; }
    		else if (thing == "y") { return parseFloat(t.join(""))*60*60*24*365; }
    		else { return parseFloat(string); }
		}
		format(string) {
    		let t = string.split("");
    		let thing = t.pop();
    
    		if (thing == "s") { return `${t.join("")} seconds`; }
			else if (thing == "ms") { return `${t.join("")} milliseconds`; }
    		else if (thing == "m") { return `${t.join("")} minutes`; }
    		else if (thing == "h") { return `${t.join("")} hours`; }
    		else if (thing == "d") { return `${t.join("")} days`; }
    		else if (thing == "w") { return `${t.join("")} weeks`; }
    		else if (thing == "y") { return `${t.join("")} years`; }
		}
	}
	date = this.time;
	times = this.time;
	
	
	/* voice */
	voice = new class {
		fetch = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let vcs = await psc.guild.VCs(guild);
			for (let i = 0; i < vcs.length; i++) {
				let channel = vcs[i];

				if (channel.members.has(user.id)) return channel;
			}
			return null;
		}
		find(user, func) { return this.fetch(user, func); }
		
		mute = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let channel = await psc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(true);
			}
		}

		unmute = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let channel = await psc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(false);
			}
		}

		deafen = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let channel = await psc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setDeaf(true);
			}
		}

		undeafen = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let channel = await psc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setDeaf(false);
			}
		}

		lockUser = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let channel = await psc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(true);
				vcUser.voice.setDeaf(true);
			}
		}

		unlockUser = async function(user, guild=null) {
			var [psc, client, ctx] = Holder;
			let channel = await psc.voice.fetch(user, guild);

			if (channel.members.has(user.id)) {
				let vcUser = channel.members.get(user.id);
				vcUser.voice.setMute(false);
				vcUser.voice.setDeaf(false);
			}
		}
		
		lock = async function(channel, guild=null) {
			var [psc, client, ctx] = Holder;
			let vc = (guild) ? await ctx.guild.channels.fetch(channel.id) : await ctx.guild.channels.fetch(channel.id);
			vc.members.forEach( (user) => {
				user.voice.setMute(true); 
				user.voice.setDeaf(true);
			});
		}

		unlock = async function(channel, guild=null) {
			var [psc, client, ctx] = Holder;
			let vc = (guild) ? await ctx.guild.channels.fetch(channel.id) : await ctx.guild.channels.fetch(channel.id);
			vc.members.forEach( (user) => {
				user.voice.setMute(false); 
				user.voice.setDeaf(false);
			});
		}
		
		join = async function(channel) {
			voice.joinVoiceChannel({
            	channelId: channel.id,
            	guildId: channel.guild.id,
            	adapterCreator: channel.guild.voiceAdapterCreator
        	});
		}
		
		leave = async function(channel) {
			const connection = voice.getVoiceConnection(channel.guild.id);
			try { connection.destroy(); } catch(err) {}
		}
	}
	
	/* guild */
	guild = new class {
		memberCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.members(guild);
			return stuff.length;
		}

		userCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.users(guild);
			return stuff.length;
		}

		botCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.bots(guild);
			return stuff.length;
		}
		
		roleCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.roles(guild);
			return stuff.length;
		}

		stuffCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.stuff(guild);
			return stuff.length;
		}
		
		channelCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.channels(guild);
			return stuff.length;
		}

		textChannelCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.textChannels(guild);
			return stuff.length;
		}
		TCCount = async function(guild=null) { return this.textChannelCount(guild); }

		voiceChannelCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.voiceChannels(guild);
			return stuff.length;
		}
		VCCount = async function(guild=null) { return this.voiceChannelCount(guild); }

		threadChannelCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.threadChannels(guild);
			return stuff.length;
		}
		threadCount = async function(guild=null) { return this.threadChannelCount(guild); }

		categoryCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.categories(guild);
			return stuff.length;
		}
		
		emojiCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.emojis(guild);
			return stuff.length;
		}
		
		stickerCount = async function(guild=null) {
			var [psc, cilent, ctx] = Holder;
			let stuff = await psc.guild.stickers(guild);
			return stuff.length;
		}

		members = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.members.fetch());
			else return Soup.from(await guild.members.fetch());
		}

		users = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var members;
			
			if (!guild) members = Soup.from(await ctx.guild.members.fetch());
			else members = Soup.from(await guild.members.fetch());

			return members.filter( (id) => {
				return !psc.fetchUser(id).bot;
			});
		}

		bots = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var members;
			
			if (!guild) members = Soup.from(await ctx.guild.members.fetch());
			else members = Soup.from(await guild.members.fetch());

			return members.filter( (id) => {
				return psc.fetchUser(id).bot;
			});
		}

		roles = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.roles.fetch());
			else return Soup.from(await guild.roles.fetch());
		}

		stuff = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.channels.fetch());
			else return Soup.from(await guild.channels.fetch());
		}

		channels = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type != 4;
			});
		}

		categories = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 4;
			});
		}

		textChannels = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 0;
			});
		}
		TCs = async function(guild=null) { return this.textChannels(guild); }

		voiceChannels = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 2;
			});
		}
		VCs = async function(guild=null) { return this.voiceChannels(guild); }

		threadChannels = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			var channels;
			
			if (!guild) channels = Soup.from(await ctx.guild.channels.fetch());
			else channels = Soup.from(await guild.channels.fetch());

			return channels.filter( (id, channel) => {
				return channel.type == 11;
			});
		}
		threads = async function(guild=null) { return this.threadChannels(guild); }
		
		emojis = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.emojis.fetch());
			else return Soup.from(await guild.emojis.fetch());
		}

		stickers = async function(guild=null) {
			var [psc, client, ctx] = Holder;
			
			if (!guild) return Soup.from(await ctx.guild.stickers.fetch());
			else return Soup.from(await guild.stickers.fetch());
		}
	}
	server = this.guild;

	reply(content, extras=null) {
		return Fuck();
		async function Fuck() {
			var [psc, client, ctx] = Holder;
			if (content && extras) {
				extras["content"] = content; var message = await ctx.reply(extras);
			}
			else if (typeof content == "object") {
				extras = content; var message = await ctx.reply(extras);
			}
			else {
				var message = await ctx.reply(content, extras);
			}
			if (extras && extras.deleteAfter) {
				setTimeout( () => { message.delete().catch(e=>{}); }, psc.time.parse(extras.deleteAfter)*1000);
			}
			return message;
		}
	}
		
	send(content, extras=null) {
		return Fuck();
		async function Fuck() {
			var [psc, client, ctx] = Holder;
			if (content && extras) {
				extras["content"] = content; var message = await ctx.channel.send(extras);
			}
			else if (typeof content == "object") {
				extras = content; var message = await ctx.channel.send(extras);
			}
			else {
				var message = await ctx.channel.send(content, extras);
			}
			if (extras && extras.deleteAfter) {
				setTimeout( () => { message.delete().catch(e=>{}); }, psc.time.parse(extras.deleteAfter)*1000);
			}
			return message;
		}
	}
	
	/* channel */
	channel = new class {
		permissions = new class {
			sync(channel=null) {
				var [psc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.lockPermissions();
				} else {
					channel.lockPermissions();
				}
			}

			set(array, channel=null) {
				var [psc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.permissionOverwrites.set(array);
				} else {
					channel.permissionOverwrites.set(array);
				}
			}

			edit(id, permissions, channel=null) {
				var [psc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.permissionOverwrites.edit(id, permissions);
				} else {
					channel.permissionOverwrites.edit(id, permissions);
				}
			}

			delete(id, channel=null) {
				var [psc, client, ctx] = Holder;
				if (!channel) {
					ctx.channel.permissionOverwrites.delete(id);
				} else {
					channel.permissionOverwrites.delete(id);
				}
			}
		}
		
		send(content, extras=null) {
			return Fuck();
			async function Fuck() {
				var [psc, client, ctx] = Holder;
				if (content && extras) {
					extras["content"] = content; var message = await ctx.channel.send(extras);
				}
				else if (typeof content == "object") {
					extras = content; var message = await ctx.channel.send(extras);
				}
				else {
					var message = await ctx.channel.send(content, extras);
				}
				if (extras && extras.deleteAfter) {
					setTimeout( () => { message.delete(); }, psc.time.parse(extras.deleteAfter)*1000);
				}
				return message;
			}
		}
		
		purge(amount, channel=null) {
			var [psc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.bulkDelete(amount);
			} else {
				channel.bulkDelete(amount);
			}
		}
		
		lock(channel=null) {
			var [psc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: false });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: false });
			}
		}

		unlock(channel=null) {
			var [psc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: true });
			} else {
				channel.permissionOverwrites.edit(ctx.guild.roles.everyone.id, { SendMessages: true });
			}
		}
		
		setSlowmode(time, channel=null) {
			var [psc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.setRateLimitPerUser(time);
			} else {
				channel.setRateLimitPerUser(time);
			}
		}

		removeSlowmode(channel=null) {
			var [psc, client, ctx] = Holder;
			if (!channel) {
				ctx.channel.setRateLimitPerUser(0);
			} else {
				channel.setRateLimitPerUser(0);
			}
		}
		noSlowmode(channel=null) { return this.removeSlowmode(channel); }
	}

	/* users and permissions */

	permissionList = {
		"createInvite": "CreateInstantInvite",
		"kickMembers": "KickMembers",
		"kick": "KickMembers",
		"banMembers": "BanMembers",
		"ban": "BanMembers",
		"moderateMembers": "ModerateMembers",
		"moderate": "ModerateMembers",
		"administrator": "Administrator",
		"admin": "Administrator",
		"manageChannels": "ManageChannels",
		"manageGuild": "manageGuild",
		"addReactions": "AddReactions",
		"reactions": "AddReactions",
		"react": "AddReactions",
		"viewAuditLog": "ViewAuditLogs",
		"viewLogs": "ViewAuditLogs",
		"auditLogs": "ViewAuditLogs",
		"logs": "ViewAuditLogs",
		"prioritySpeaker": "PrioritySpeaker",
		"stream": "Stream",
		"viewChannel": "ViewChannel",
		"sendMessages": "SendMessages",
		"send": "SendMessages",
		"message": "SendMessages",
		"sendTTSMessages": "SendTTSMessages",
		"sendTTS": "SendTTSMessages",
		"manageMessages": "ManageMessages",
		"embedLinks": "EmbedLinks",
		"links": "EmbedLinks",
		"attachFiles": "AttachFiles",
		"sendFiles": "AttachFiles",
		"files": "AttachFiles",
		"readMessageHistory": "ReadMessageHistory",
		"readHistory": "ReadMessageHistory",
		"viewMessageHistory": "ReadMessageHistory",
		"viewHistory": "ReadMessageHistory",
		"mentionEveryone": "MentionEveryone",
		"pingEveryone": "MentionEveryone",
		"everyone": "MentionEveryone",
		"useExternalEmojis": "UseExternalEmojis",
		"externalEmojis": "UseExternalEmojis",
		"useEmojis": "UseExternalEmojis",
		"useExternalStickers": "UseExternalStickers",
		"externalStickers": "UseExternalStickers",
		"useStickers": "UseExternalStickers",
		"viewGuildInsights": "ViewGuildInsights",
		"guildInsights": "ViewGuildInsights",
		"insights": "ViewGuildInsights",
		"connect": "Connect",
		"voiceConnect": "Connect",
		"speak": "Speak",
		"voiceSpeak": "Speak",
		"muteMembers": "MuteMembers",
		"mute": "MuteMembers",
		"voiceMute": "MuteMembers",
		"deafenMembers": "DeafenMembers",
		"deafen": "DeafenMembers",
		"voiceDeafen": "DeafenMembers",
		"moveMembers": "MoveMembers",
		"move": "MoveMembers",
		"voiceMove": "MoveMembers",
		"useVAD": "UseVAD",
		"VAD": "UseVAD",
		"changeNickname": "ChangeNickname",
		"nickname": "ChangeNickname",
		"manageNicknames": "ManageNickname",
		"nicknames": "ManageNickname",
		"manageRoles": "ManageRoles",
		"roles": "ManageRoles",
		"manageWebhooks": "ManageWebhooks",
		"manageEmojisAndStickers": "ManageEmojisAndStickers",
		"manageEmojis": "ManageEmojisAndStickers",
		"manageStickers": "ManageEmojisAndStickers",
		"emojis": "ManageEmojisAndStickers",
		"stickers": "ManageEmojisAndStickers",
		"emojisAndStickers": "ManageEmojisAndStickers",
		"useApplicationCommands": "UseApplicationCommands",
		"useCommands": "UseApplicationCommands",
		"applicationCommands": "UseApplicationCommands",
		"commands": "UseApplicationCommands",
		"requestToSpeak": "RequestToSpeak",
		"manageEvents": "ManageEvents",
		"events": "ManageEvents",
		"manageThreads": "ManageThreads",
		"threads": "ManageThreads",
		"createPublicThreads": "CreatePublicThreads",
		"publicThreads": "CreatePublicThreads",
		"createPrivateThreads": "CreatePrivateThreads",
		"privateThreads": "CreatePrivateThreads",
		"sendMessagesInThreads": "SendMessagesInThreads",
		"sendThreadMessages": "SendMessagesInThreads",
		"threadMessages": "SendMessagesInThreads",
		"messageInThreads": "SendMessagesInThreads",
		"useEmbeddedActivities": "UseEmbeddedActivities",
		"useActivities": "UseEmbeddedActivities",
		"embeddedActivities": "UseEmbeddedActivities",
		"activities": "UseEmbeddedActivities"
	};
	
	user = new class {
		avatar(user=null, dynamic=false) {
			var [psc, client, ctx] = Holder;
			if (!user) {
				return ctx.author.displayAvatarURL(dynamic);
			} else {
				return user.displayAvatarURL(dynamic);
			}
		}
		avatarUrl(user=null, dynamic=false) { return this.avatar(user, dynamic); }
		avatarURL(user=null, dynamic=false) { return this.avatar(user, dynamic); }
		avatar_url(user=null, dynamic=false) { return this.avatar(user, dynamic); }

		ban(user, extras={reason:null, time:null, deleteTo:null}) {
			var [psc, client, ctx] = Holder;

			if (extras.time) {
				setTimeout( () => {
					ctx.guild.bans.remove(user.id);
				}, psc.time.parse(extras.time)*1000);
			}

			return ctx.guild.bans.create(user.id, {reason: extras.reason, deleteMessageSeconds: psc.time.parse(extras.deleteTo)});
		}
		
		roles = new class {
			cache(user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.roles.cache;
				} else {
					return user.roles.cache;
				}
			}
			
			list(user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return Array.from(ctx.member.roles.cache, (role) => {
						return role[1].name;
					});
				} else {
					return Array.from(user.roles.cache, (role) => {
						return role[1].name;
					});
				}
			}

			ids(user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return Array.from(ctx.member.roles.cache, (role) => {
						return role[0];
					});
				} else {
					return Array.from(user.roles.cache, (role) => {
						return role[0];
					});
				}
			}
			
			has(roleId, user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.roles.cache.has(roleId);
				} else {
					return user.roles.cache.has(roleId);
				}
			}

			hasName(name, user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.roles.cache.some(role => role.name == name);
				} else {
					return user.roles.cache.some(role => role.name == name);
				}
			}
		}

		permissions = new class {
			cache(user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.permissions.serialize();
				} else {
					return user.permissions.serialize();
				}
			}

			list(user=null) {
				var [psc, client, ctx] = Holder;
				if (!user) {
					return ctx.member.permissions.toArray();
				} else {
					return user.permissions.toArray();
				}
			}

			has(permissions, user=null) {
				var [psc, client, ctx] = Holder;
				var perms = [];
				
				permissions.forEach( (perm) => {
					let permName = (Object.keys(psc.permissionList).includes(perm))
						? psc.permissionList[perm]
					: (Object.values(psc.permissionList).includes(perm))
						? perm
					: function() { throw new CoolError("Has Permissions", "Permission does not exist.") }();

					perms.push(permName);
				});

				for (let i = 0; i < perms.length; i++) {
					if (!user) {
						if (!ctx.member.permissions.toArray().includes(perms[i])) {
							return false;
						}
					} else {
						if (!user.permissions.toArray().includes(perms[i])) {
							return false;
						}
					}
				}
				return true;
			}
		}

		roleCache(user=null) {
			return this.roles.cache(user);
		}

		roleList(user=null) {
			return this.roles.list(user);
		}

		rolesIds(user=null) {
			return this.roles.ids(user);
		}

		hasRole(roleId, user=null) {
			return this.roles.has(roleId, user);
		}
		
		hasRoleName(name, user=null) {
			return this.roles.hasName(name, user);	
		}

		permissionCache(user=null) {
			return this.permissions.cache(user);
		}

		permissionList(user=null) {
			return this.permissions.list(user);
		}

		hasPermissions(permissions, user=null) {
			return this.permissions.has(permissions, user);
		}
		hasPerms(permissions, user=null) { return this.hasPermissions(permissions, user); }
		
		hasPermission(permission, user=null) {
			return this.permissions.has([permission], user);
		}
		hasPerm(permission, user=null) { return this.hasPermission(permission, user); }
	}
	member = this.user;
	author = this.user;
	
    /* running */
    run(token) {
        this.client.login(token);
    }
    
    login(token) {
    	this.run(token);
    }
}

function ClientHandler(psc, client) {
	console.log("Commands Enabled");
	client.on("messageCreate", async (ctx) => {
		Holder = [psc, client, ctx];
		psc.commandHandler(ctx);
	});
}

function FuckPromises(stupids, func, user=false) {
	var [psc, client, ctx] = Holder;
	var stupidList = [];
	stupids.forEach( (stupid) => {
		stupidList.push( (user) ? psc.fetchUser(stupid.id) : stupid);
	});

	return func(stupidList);
}

class Embed {
	constructor(obj) {
		if (obj.color) { obj.color = obj.color.colorFormat(); }
		if (obj.author) {
			if (obj.author.icon) { obj.author.icon_url = obj.author.icon; }
			else if (obj.author.iconURL) { obj.author.icon_url = obj.author.iconURL; }
		}
		if (typeof obj.thumbnail == "string") {
			let thumbnail = obj.thumbnail;
			obj.thumbnail = { url: thumbnail };
		}
		if (obj.fields) {
			let fixFields = [];
			
			obj.fields.forEach( (field) => {
				fixFields.push(field);
				if (field.newline) { fixFields.push({ name:"** **", value: "** **", inline: false}); }
			});

			obj.fields = fixFields;
		}
		if (typeof obj.image == "string") {
			let image = obj.image;
			obj.image = { url: image };
		}
		if (obj.timestamp) {
			if (obj.timestamp.toLowerCase() == "current" || obj.timestamp.toLowerCase() == "now") obj.timestamp = new Date().toISOString();
		}
		if (obj.footer) {
			if (typeof obj.footer == "string") {
				let footer = obj.footer;
				obj.footer = { text: footer };
			}
			
			if (obj.footer.name) { obj.footer.text = obj.footer.name; }
			if (obj.footer.icon) { obj.footer.icon_url = obj.footer.icon; }
			else if (obj.footer.iconURL) { obj.footer.icon_url = obj.footer.iconURL; }
		}
		
		return obj;
	}
}

class Selection {
	constructor(obj) {
		obj.type = 3;
		if (obj.id) {
			obj.custom_id = obj.id;
		}
		if (obj.label || obj.text) {
			obj.placeholder = (obj.label) ? obj.label : obj.text;
		}
		if (obj.minimum || obj.min) {
			obj.min_values = (obj.minimum) ? obj.minimum : obj.min;
		}
		if (obj.maximum || obj.max) {
			obj.max_values = (obj.maximum) ? obj.maximum : obj.max;
		}

		return obj;
	}
}
var SelectMenu = this.Selection;

function buttonStyle(style) {
	return (typeof style == "number")
		? style
	: (style.toLowerCase() == "primary")
		? 1
	: (style.toLowerCase() == "secondary")
		? 2
	: (style.toLowerCase() == "success")
		? 3
	: (style.toLowerCase() == "danger")
		? 4
	: (style.toLowerCase() == "link")
		? 5
	: null;
}

class ActionRow {
	constructor(array) {
		return { type: 1, components: array };
	}
}
var Row = ActionRow;

class Button {
	constructor(obj) {
		var [psc] = Holder;
		obj.type = 2;
		if (obj.id) {
			obj.custom_id = obj.id;
		}
		if (obj.style) {
			obj.style = buttonStyle(obj.style);
		}
		
		return obj;
	}
}


module.exports = { PSClient, Embed, ActionRow, Row, Button, Selection, SelectMenu, Stew, Soup };
