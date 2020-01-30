/* Modified from https://github.com/LuckPerms/clippy/blob/master/main.js */
import { Client } from 'discord.js';
import { token } from "./config.json";
import { readdirSync } from "mz/fs"; // mz/fs works exactly the same as fs but with promises

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

readdirSync("modules")
    .map(mod => `./modules/${mod}`)
    .map(mod => require(mod))
    .forEach(mod => mod(client));

client.login(token);