## 05-11-23
- added command !transfer
- added command !import
- updated README.md file
- updated wiki pages
- added events transfer accept and transfer decline
- updated asset steal responses
- started setting up heroku stuff

## 05-10-23
- updated cooldown messages to have the time left in them as a unix timestamp
- updated package discord+ps to have a catch for deleteAfter so it doesn't crash when a message is deleted before the bot can delete it
- updated package discord+ps to have raw and relative values for cooldowns that let you see how long the cooldown has left
- added some extra catches to make commands not break when spammed hopefully
- increased cooldowns under 3s to 3s+
- added default cooldown of 3s for commands that don't have any

## 05-09-23
- added commands !crime and !steal
- added assets crime responses and steal responses
- added functionality to command !leaderboard
- fixed a bug with cooldown responses where they wouldn't delete
- added timestamps to shouts
- updated command !create to show icons/banners added in the message

## 05-08-23
- added commands !slots and !uslots
- added commands !deposit and !withdraw
- added command !work
- added command !disband
- added command !give
- added command !gold
- added command !settings
- added events disband accept and disband decline
- updated assets colorify and emojis
- added asset caps

## 05-04-23
- added commands !op and !deop
- added command !leaderboard
- added command !shout
- compressed force commands into !force
- compressed funds commands into !funds
- added id attribute for !set
- updated all commands that use Clanner set
- updated class Clanner set functions to require a guildID
- added function setID() and disband() to class Clanner
- added function in() to class Econner
- updated class Econner to have user and clan leaderboards

## 05-03-23
- added command !prefix
- added command !kick
- added config/prefixes.json
- updated package src/packages/discordpps
- updated prefix in psc: index.js
- updated majority of commands that use prefixes to work with the new prefix stuff
- added event prefix mention
- added command !icon and !banner
- updated command !ban
- you can't yourself
- added command files !inventory !item and !leaderboard
- added class files Item and ItemTemplate
- added data files items.json and inventories.json

## 05-02-23
- added command !set
- added command !allies
- added command !enemies
- changed config/defaults.json clan images to be from this repo
- added package @napi-rs/canvas
- upscaled icon and transparent icon to be 500x500
- upscaled banner to be 1500x500
- added file config/settables.json
- updated class Clanner to have canSet()
- updated class Econner to have deposit() and withdraw()
- updated class ClanTemplate to make them have a resize value
- added folder and related files: *[src/assets/images](https://github.com/nuttmegg/Clam/tree/main/src/assets/images) | [src/assets/images/icon.png](https://github.com/nuttmegg/Clam/blob/main/src/assets/images/icon.png) | [src/assets/images/banner.png](https://github.com/nuttmegg/Clam/blob/main/src/assets/images/banner.png) | [src/assets/images/icon_transparent.png](https://github.com/nuttmegg/Clam/blob/main/src/assets/images/icon_transparent.png)*

## 05-01-23
- added command !export
- added command !dump
- added !leave
- added commands and events for !list and !listall
- updated Catch and Clanner classes
- added a moderator section for !get and !getglobal that shows the bans, icon, banner and if the clan is gold
- updated it so !ban can't ban the owner of the clan

## 04-27-23
- updated src/assets to split it into multiple files
- moved src/assets/1.3.js and src/assets/1.4.js to src/assets/versions
- updated commands that use acceptEmoji, declineEmoji, and goldEmoji so that it's now emojis.accept, emojis.decline, and emojis.gold
- added src/classes/Catch.js even tho it's not a class but whatever
- updated src/packages/discordpps/index.js
- updated commands to use the new Catch stuff
- added ban because fuck marx (also unban)

## 04-26-23
- added src/commands/join.js
- updated config/list.json
- updated src/commands/invite.js
- updated src/commands/help.js
- updated src/classes/ClanTemplate.js
