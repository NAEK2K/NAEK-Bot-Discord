const config = require('./config.json')

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log("--- NAEK Bot Activated ---")
})

client.on('message', (msg) => {
    console.log(msg.content)
    let msgSplit = msg.content.split()
    if(msgSplit[0].split('')[0] != '-') return
    msg.channel.send('Command received.')
})

client.login(config.discordKey)