const errorEmbed = require("../../utils/errorEmbed");

module.exports.run = async (client, message, args) => {
	// message.channel.send(`Kick ${message.mentions.users.first().tag} reason: ${args.splice(1).join(" ")}`);
	// const reason = args.length > 1 ? args.splice(1).join(" ") : "";
	// try {
	// 	message.mentions.members.first().kick(reason);
	// } catch {
	// 	message.reply("I do not have permissions to kick " + message.members.mentions.first());
	// }
	errorEmbed("Hello, this is a test", message);
};

module.exports.help = {
	name: "kick",
	aliases: [],
	description: "Kick the member",
	usage: "kick @member [reason]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	authNeeded: "KICK_MEMBERS", // eg. KICK_MEMBERS
	delete: true,
	mention: true,
	args: false,
};
