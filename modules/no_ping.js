/* Modified from https://github.com/LuckPerms/clippy/blob/master/modules/no_ping.js */
const data = require("../data.json");

module.exports = function(client) {
  client.on("message", async msg => {
    const author = msg.author;
    const channel = msg.channel;
    const mentions = msg.mentions;

    // Ignore bots
    if (author.bot) return;

    // Ignore messages that don't mention anyone
    if (channel.type !== "text") return;
    if (mentions.members.size === 0) return;

    // const senderIsStaff = msg.member.roles.some(role => data.staff_roles.indexOf(role.name) !== -1);
    // if (senderIsStaff) {
    //     return;
    // }

    // Find if the pinged users have recently sent message
    channel
      .fetchMessages({ before: msg.id, limit: 25 })
      .then(messages => {
        const foundInHistory = mentions.members.filter(member => messages.some(oldMsg => oldMsg.author.id === member.id)).length;
        const mentioned = mentions.members.length
        const replying = foundInHistory === mentioned;
        if (!replying) {
            msg.channel.send(
                `Hey ${msg.author.username}! Please don't tag others unless replying.`
            );
        }
      })
      .catch(console.error);
  });
};