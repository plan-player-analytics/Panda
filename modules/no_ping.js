/* Modified from https://github.com/LuckPerms/clippy/blob/master/modules/no_ping.js */
const data = require("../data.json");

function filterRecent(currentDate) {
    return messages => {
        return messages.filter(message => currentDate - message.createdTimestamp <= 216000); // 60 hours, 2.5 days
    };
}

function isStaff(member) {
    return member.roles.some(role => data.staff_roles.indexOf(role.name) !== -1);
}

module.exports = function (client) {
    client.on("message", async msg => {
        const author = msg.author;
        const channel = msg.channel;

        // Ignore messages from non-text channels
        if (channel.type !== "text") return;

        // Bots can mention
        if (author.bot) return;

        // Webhooks don't have members, and they are trusted to be respectful
        if (msg.webhookID != null) return;

        // Staff can mention
        if (isStaff(msg.member)) return;

        // Get the map of people who were mentioned in the message
        const mentioned = msg.mentions.members
            .filter(member => !member.user.bot)        // Filter out bots, they don't have feelings
            .filter(member => member.id !== author.id) // Filter out users mentioning themselves
            // Ignore mentions of users with '@me' in their nick (include mentions of users with no '@me' in nick)
            .filter(member => !member.nickname || member.nickname.toLowerCase().indexOf("@me") === -1);

        // Nobody was mentioned
        if (mentioned.size === 0) return;

        const currentDate = new Date().getTime();
        channel
            .fetchMessages({before: msg.id, limit: 50})
            .then(filterRecent(currentDate))
            .then(messages => {
                messages.forEach(msg => {
                    // if (isStaff(msg.member)) { // Check to only allow mentioning a staff if they mentioned the person mentioning them (if desired in the future)
                    //     msg.mentions.members.forEach(
                    //         (member, id) => mentioned.delete(id));
                    //     return;
                    // }

                    // Remove the user who sent a message from the list of mentioned users
                    mentioned.delete(msg.author.id);
                })

                // The message author mentioned someone that hadn't sent a message in the given amount of time
                if (mentioned.size > 0) {
                    msg.channel.send(
                        `Hey ${msg.author.username}! Please don't tag others unless replying.`
                    );
                    console.log(`Notified ${msg.author.username} about pinging`);
                }
            })
            .catch(console.error);
    });
};
