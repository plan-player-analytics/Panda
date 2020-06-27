/* Modified from https://github.com/LuckPerms/clippy/blob/master/modules/no_ping.js */
const data = require("../data.json");

function filterRecent(currentDate) {
    return messages => {
        return messages.filter(message => currentDate - message.createdTimestamp <= 216000); // 60 hours, 2.5 days
    };
}

module.exports = function (client) {
    client.on("message", async msg => {
        const author = msg.author;
        const channel = msg.channel;
        const mentions = msg.mentions;

        // Ignore bots
        if (author.bot) return;

        // Ignore messages that don't mention anyone
        if (channel.type !== "text") return;
        if (mentions.members.size === 0) return;

        const senderIsStaff = msg.member.roles.some(role => data.staff_roles.indexOf(role.name) !== -1);
        if (senderIsStaff) {
            return;
        }

        const currentDate = new Date().getTime();
        // Find if the pinged users have recently sent message
        console.log(currentDate);
        channel
            .fetchMessages({before: msg.id, limit: 50})
            .then(messages => {
                messages.forEach(message => console.log(message.createdAt))
                return messages;
            })
            .then(filterRecent(currentDate))
            .then(messages => {
                const foundInHistory = mentions.members
                    .filter(member => messages.some(oldMsg => oldMsg.author.id === member.id))
                    .size;
                const mentioned = mentions.members
                    .filter(member => !member.nickname || !member.nickname.includes('@me'))
                    .size;
                const replying = foundInHistory === mentioned;
                if (!replying) {
                    msg.channel.send(
                        `Hey ${msg.author.username}! Please don't tag others unless replying.`
                    );
                    console.log(`Notified  ${msg.author.username} about pinging`)
                }
            })
            .catch(console.error);
    });
};