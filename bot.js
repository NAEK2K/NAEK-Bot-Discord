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
        let testMessage = `test to ping you <@${msg.author.id}>`
        msg.channel.send("Developer's Site: https://naek.ca")
        msg.channel.send(testMessage)
    }
    if(msgSplit[0] == '-set-welcome-channel') {
        db.get('guilds').find({id: msg.guild.id}).assign({welcomeChannel: msgSplit[1]}).write()
        msg.channel.send("Welcome channel updated!")
    }
    if(msgSplit[0] == '-set-welcome-message') {
        db.get('guilds').find({id: msg.guild.id}).assign({welcomeMessage: msg.content.substr(21)}).write()
        msg.channel.send("Welcome message updated!")
    }
    if(msgSplit[0] == '-set-goodbye-channel') {
        db.get('guilds').find({id: msg.guild.id}).assign({goodbyeChannel: msgSplit[1]}).write()
        msg.channel.send("Goodbye channel updated!")
    }
    if(msgSplit[0] == '-set-goodbye-message') {
        db.get('guilds').find({id: msg.guild.id}).assign({goodbyeMessage: msg.content.substr(21)}).write()
        msg.channel.send("Goodbye message updated!")
    }
})

//Handles when a member joins
//The channel id is hardcoded to the Hideout server bot test channel.
client.on('guildMemberAdd', (member) => {
    let welcomeChannel = db.get('guilds').find({id: member.guild.id}).get('welcomeChannel').value()
    let welcomeMessage = db.get('guilds').find({id: member.guild.id}).get('welcomeMessage').value()
    client.channels.fetch(welcomeChannel).then((channel) => {
        channel.send(welcomeMessage.toString().replace("<@user>", `<@${member.id}>`));
    }).catch(console.error);
});

//Handles when a member leaves
//The channel id is hardcoded to the Hideout server bot test channel.
client.on('guildMemberRemove', (member) => {
    let goodbyeChannel = db.get('guilds').find({id: member.guild.id}).get('goodbyeChannel').value()
    let goodbyeMessage = db.get('guilds').find({id: member.guild.id}).get('goodbyeMessage').value()
    client.channels.fetch(goodbyeChannel).then((channel) => {
        channel.send(goodbyeMessage.toString().replace("<@user>", `<@${member.id}>`));
    }).catch(console.error);
});

client.on('guildCreate', (guild) => {
    db.get('guilds').push({id: guild.id, welcomeChannel: '', welcomeMessage: '', welcomeEnable: 1, goodbyeChannel: '', goodbyeMessage: '', goodbyeEnable: 1, joinableRanks: [], adminRanks: []}).write()
})

client.login(config.discordKey)