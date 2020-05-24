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
        let testMessage = "Hey <#713942346760323152>"
        msg.channel.send("Developer's Site: https://naek.ca")
        msg.channel.send(testMessage)
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