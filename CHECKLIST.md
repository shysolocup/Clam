**DON'T FORGET THIS STUFF!!!**<br>
the code management hell and the goofy shit 🙏
<br>
<br>

**ALSO DON'T DELETE THIS FILE IDIOT!!!!!!!!**
<br>
<br>

Commands Checklist
- [x] ~~allies~~
- [x] ~~balance~~
- [x] ~~ban~~
- [x] ~~banner~~
- [ ] buy
- [x] ~~create~~
- [ ] crime
- [x] ~~deop~~
- [x] ~~deposit~~
- [x] ~~disband~~
- [x] ~~dump~~
- [x] ~~enemies~~
- [x] ~~export~~
- [ ] force
- [ ] funds
- [x] ~~get~~
- [x] ~~getglobal~~
- [x] ~~give~~
- [x] ~~gold~~
- [x] ~~help~~
- [x] ~~icon~~
- [ ] import
- [ ] inventory
- [x] ~~invite~~
- [ ] item
- [x] ~~join~~
- [x] ~~kick~~
- [ ] leaderboard
- [x] ~~leave~~
- [x] ~~list~~
- [x] ~~listall~~
- [x] ~~op~~
- [x] ~~prefix~~
- [ ] sell
- [x] ~~set~~
- [x] ~~settings~~
- [ ] shop
- [x] ~~shout~~
- [x] ~~slots~~
- [ ] steal
- [x] ~~unban~~
- [ ] use
- [x] ~~uslots~~
- [x] ~~withdraw~~
- [x] ~~work~~
<br>

Update Checklist
- [x] ~~add new shit to the command list~~
- [x] ~~add a name argument to create~~
- [x] ~~change set to be !set (attr) (clanID) (value)~~
- [x] ~~add an unlisted tag for clans~~
- [x] ~~add admin help page~~
- [ ] add forceban forceunban and forcekick
- [x] ~~add the funds commands in the commands list~~
- [x] ~~add the new sections for the help command~~
- [x] ~~add the help button that lets you get a command's info by name with the select menu stuff~~
- [x] ~~add the unlisted status as status 3 (it's private but it doesn't show up in the list command the only way to join is with forcejoin or invite)~~
- [x] ~~update get and getglobal commands and events to work with unlisted status~~
- [ ] attempt to add more economy commands put ideas in the part below this
- [ ] add a change log thing that lets me announce updates and shit
- [x] ~~add unlisted admin command so that admins can see unlisted clans~~
- [ ] actually add steal for economy lol
- [x] ~~update economy system to give less from working~~
- [ ] update economy system to have a working shop that admins can add things to
- [ ] get the bot on an actual server like heroku so that it runs all the time
<br>

Economy Update Checklist
- [ ] !shop is like list but it shows all default items then clan items
- [ ] !buy gives pearls if item is from a clan
- [ ] !item create (id) (name)
- [ ] !item remove (id) (name)
- [ ] !item set (attr) (id) (value)
- [ ] !item set (id) (attr) (value)
- [ ] items can have roles attached if the person who creates it is an admin
- [ ] server leaderboard for hands and clans (hopefully)
- [ ] gold multiplies the earnings from work crime and steal by like x1.5
<br>

items.json
```json
{
    "guildID": {
        "clanID": {
            "item name": {
                "name": "item name",
                "description": "item description",
                "creator": "creatorID",
                "guild": "guildID",
                "clan": "clanID",
                "roles": {
                    "add": [
                        "roleID 1",
                        "roleID 2"
                    ],
                    "remove": [
                        "roleID 3",
                        "roleID 4"
                    ]
                },
                "price": 0
            }
        }
    }
}
```
inventories.json
```json
{
    "userID": [
        "clanID/item name 1",
        "clanID/item name 2"
    ]
}
```
<br>

Economy Games Checklist
- [ ] that one card game from club penguin lol
- [x] ~~ultimate slot machine that can 500x your bet if you win~~
