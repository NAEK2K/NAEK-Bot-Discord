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

//Handles when a member joins
//The channel id is hardcoded to the Hideout server bot test channel.
client.on('guildMemberAdd', (member) => {
    console.log("New User Joined");
    client.channels.fetch('713873076374208512').then((channel) => {
        channel.send("Welcome " + member.user.username + "!");
    }).catch(console.error);
});

//Handles when a member leaves
//The channel id is hardcoded to the Hideout server bot test channel.
client.on('guildMemberRemove', (member) => {
    console.log("New User Joined");
    client.channels.fetch('713873076374208512').then((channel) => {
        channel.send("Goodbye " + member.user.username + "!");
    }).catch(console.error);
});

client.on('guildCreate', (guild) => {
    db.get('guilds').push({id: guild.id, rankSettings: {joinable: {}}, welcomeSettings: {channel: '', message: ''}}).write()
})

client.on('message', (msg) => {
    if(msg.content.charAt(0) != '-') return // ignore messages that aren't commands
    let msgSplit = msg.content.split()
    msg.channel.send('Command received.')
})

client.login(config.discordKey)