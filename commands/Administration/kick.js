const errorEmbed = require("../../utils/errorEmbed");
const successEmbed = require("../../utils/successEmbed");

module.exports.run = async (client, message, args) => {
	let member = message.mentions.members.first();

	if (!member.kickable) return errorEmbed(`Je ne peux pas kicker ${message.mentions.users.first()} !`, message);

	const reason = args.length > 1 ? args.splice(1).join(" ") : "";

	member.kick(reason).then(successEmbed(`${message.mentions.users.first()} à bien été kické !`, message));
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
