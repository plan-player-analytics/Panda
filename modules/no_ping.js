/* Modified from https://github.com/LuckPerms/clippy/blob/master/modules/no_ping.js */
import { staff_roles } from "../data.json";

export default function(client) {
  client.on("message", async msg => {
    const author = msg.author;
    const channel = msg.channel;
    const mentions = msg.mentions;

    // Ignore bots
    if (author.bot) return;

    // Ignore messages that don't mention anyone
    if (channel.type !== "text") return;
    if (mentions.members.size === 0) return;

    const senderIsStaff = msg.member.roles.some(role => staff_roles.indexOf(role.name) !== -1);
    if (senderIsStaff) {
        return;
    }

    // Find any messages that mention the user
    channel
      .fetchMessages({ before: msg.id, limit: 25 })
      .then(messages => {
        const replying = messages.filter(message => mentions.members.includes(message.author)).length == mentions.members.size;
        if (!replying) {
            msg.channel.send(
                `Hey ${msg.author.username}! Please don't tag others unless replying.`
            );
        }
      })
      .catch(console.error);
  });
};