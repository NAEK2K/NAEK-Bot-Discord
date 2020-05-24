const config = require('./config.json')

// lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// lowdb init
db.defaults({guilds: []}).write()

// discord.js
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log("--- NAEK Bot Activated ---")
})

client.on('message', (msg) => {
    if(msg.content.charAt(0) != '-') return // ignore messages that aren't commands
    let msgSplit = msg.content.split(' ')
    console.log(msgSplit)
    if(msgSplit[0] == '-website') {
        msg.channel.send("Developer's Site: https://naek.ca")
    }
    // welcome settings
    if(msgSplit[0] == '-set-welcome-channel') { // set channel
        db.get('guilds').find({id: msg.guild.id}).assign({welcomeChannel: msgSplit[1]}).write()
        msg.channel.send("Welcome channel updated!")
    }
    if(msgSplit[0] == '-set-welcome-message') { // set message
        db.get('guilds').find({id: msg.guild.id}).assign({welcomeMessage: msg.content.substr(21)}).write()
        msg.channel.send("Welcome message updated!")
    }
    if(msgSplit[0] == '-set-welcome') { // set status
        if(msgSplit[1] == 'enable' || msgSplit[1] == 'disable') {
            db.get('guilds').find({id: msg.guild.id}).assign({welcomeEnable: (msgSplit[1] == 'enable') ? 1 : 0}).write()
            msg.channel.send(`Welcome has been ${(msgSplit[1] == 'enable') ? 'enabled' : 'disabled'}.`)
        } else {
            msg.channel.send("Invalid parameter. -set-welcome (enable|disable)")
        }
    }
    // goodbye settings
    if(msgSplit[0] == '-set-goodbye-channel') { // set channel
        db.get('guilds').find({id: msg.guild.id}).assign({goodbyeChannel: msgSplit[1]}).write()
        msg.channel.send("Goodbye channel updated!")
    }
    if(msgSplit[0] == '-set-goodbye-message') { // set message
        db.get('guilds').find({id: msg.guild.id}).assign({goodbyeMessage: msg.content.substr(21)}).write()
        msg.channel.send("Goodbye message updated!")
    }
    if(msgSplit[0] == '-set-goodbye') { // set status
        if(msgSplit[1] == 'enable' || msgSplit[1] == 'disable') {
            db.get('guilds').find({id: msg.guild.id}).assign({goodbyeEnable: (msgSplit[1] == 'enable') ? 1 : 0}).write()
            msg.channel.send(`Goodbye has been ${(msgSplit[1] == 'enable') ? 'enabled' : 'disabled'}.`)
        } else {
            msg.channel.send("Invalid parameter. -set-goodbye (enable|disable)")
        }
    }
    // rank management
    if(msgSplit[0] == '-add-joinable-rank') { // add rank to be joinable
        if(msgSplit[1] == undefined) {
            msg.channel.send("Please supply a parameter.")
            return
        }
        let rankData = msg.content.substr(19)
        msg.guild.roles.fetch().then((r) => {
            let rankFound = false
            r.cache.forEach((item) => { // loop through role cache to find role
                if(item.name == rankData) {
                    rankFound = true
                    rankData = [item.name, item.id]
                    return
                }
            })
            if(!rankFound) {
                msg.channel.send(`That rank does not exist.`)
                return
            }
            let joinableRanks = db.get('guilds').find({id: msg.guild.id}).get('joinableRanks').value()
            if(joinableRanks.map((x) => x[0]).includes(rankData[0])) {
                msg.channel.send(`This rank is already joinable. [${rankData[0]}]`)
            } else {
                joinableRanks.push(rankData)
                db.get('guilds').find({id: msg.guild.id}).assign({joinableRanks}).write()
                msg.channel.send(`Rank has been added. [${rankData[0]}]`)
            }
        }).catch((e) => {
            console.log(e)
            msg.channel.send(`That rank does not exist.`)
        })
    }
    if(msgSplit[0] == '-join-rank') {
        if(msgSplit[1] == undefined) {
            msg.channel.send("Please supply a parameter.")
            return
        }
        let rankName = msg.content.substr(11)
        let joinableRanks = db.get('guilds').find({id: msg.guild.id}).get('joinableRanks').value()
        if(joinableRanks.map((x) => x[0]).includes(rankName)) {
            let rankID = joinableRanks[joinableRanks.map((x) => x[0]).indexOf(rankName)][1]
            msg.member.roles.add(rankID)
            msg.channel.send("Rank added.")
        }
    }
    if(msgSplit[0] == '-leave-rank') {
        if(msgSplit[1] == undefined) {
            msg.channel.send("Please supply a parameter.")
            return
        }
        let rankName = msg.content.substr(12)
        let joinableRanks = db.get('guilds').find({id: msg.guild.id}).get('joinableRanks').value()
        if(joinableRanks.map((x) => x[0]).includes(rankName)) {
            let rankID = joinableRanks[joinableRanks.map((x) => x[0]).indexOf(rankName)][1]
            msg.member.roles.remove(rankID)
            msg.channel.send("Rank removed.")
        }
    }
    if(msgSplit[0] == '-joinable-ranks') {
        let joinableRanks = db.get('guilds').find({id: msg.guild.id}).get('joinableRanks').value()
        msg.channel.send(`**Joinable Ranks**\n${joinableRanks.map((x) => x[0]+'\n').toString().replace(',', '')}` || 'No ranks are joinable.')
    }
    // development functions only
    if(msgSplit[0] == '-db-refresh') {
        db.get('guilds').remove({id: msg.guild.id}).write()
        db.get('guilds').push({id: msg.guild.id, welcomeChannel: '', welcomeMessage: '', welcomeEnable: 1, goodbyeChannel: '', goodbyeMessage: '', goodbyeEnable: 1, joinableRanks: [], adminRanks: []}).write()
        msg.channel.send("Database has been refreshed.")
    }
})

// on member join
client.on('guildMemberAdd', (member) => {
    let welcomeChannel = db.get('guilds').find({id: member.guild.id}).get('welcomeChannel').value()
    let welcomeMessage = db.get('guilds').find({id: member.guild.id}).get('welcomeMessage').value()
    client.channels.fetch(welcomeChannel).then((channel) => {
        channel.send(welcomeMessage.toString().replace("<@user>", `<@${member.id}>`));
    }).catch(console.error);
});

// on member leave
client.on('guildMemberRemove', (member) => {
    let goodbyeChannel = db.get('guilds').find({id: member.guild.id}).get('goodbyeChannel').value()
    let goodbyeMessage = db.get('guilds').find({id: member.guild.id}).get('goodbyeMessage').value()
    client.channels.fetch(goodbyeChannel).then((channel) => {
        channel.send(goodbyeMessage.toString().replace("<@user>", `<@${member.id}>`));
    }).catch(console.error);
});

// on guild join
client.on('guildCreate', (guild) => {
    db.get('guilds').push({id: guild.id, welcomeChannel: '', welcomeMessage: '', welcomeEnable: 1, goodbyeChannel: '', goodbyeMessage: '', goodbyeEnable: 1, joinableRanks: [], adminRanks: []}).write()
})

client.login(config.discordKey)