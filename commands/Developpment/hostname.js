const os = require("os");
const { infoMessage } = reqlib("/utils/infoMessages");
module.exports.run = async (client, message, args) => {
	infoMessage(`**Hostname:** ${os.hostname()}`, message.channel);
};

module.exports.help = {
	name: "hostname",
	aliases: ["host"],
	description: "Show the bot's server hostname",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
