const config = require('./config.json')

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log("--- NAEK Bot Activated ---")
})

client.on('message', (msg) => {
    if(msg.content.charAt(0) != '-') return
    let msgSplit = msg.content.split()
    msg.channel.send('Command received.')
})

client.login(config.discordKey)