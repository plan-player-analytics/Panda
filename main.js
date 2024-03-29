/* Modified from https://github.com/LuckPerms/clippy/blob/master/main.js */
const Client = require('discord.js').Client;
const token = require("./config.json").token;
const readdirSync = require("mz/fs").readdirSync; // mz/fs works exactly the same as fs but with promises

const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] }});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guild => guild.members.fetch()); // we need to do this to get roles for staff members
});

readdirSync("modules")
    .forEach(modName => {
        const mod = require(`./modules/${modName}`);
        console.log(`Loading module: ${modName}`);
        mod(client);
    });

client.login(token);