const { logMessage } = require("../../utils/infoMessages");
const { getLogs } = require("../../utils/log");

module.exports.run = async (client, message, args) => {
	let nbLines = 10;
	if (args.length > 0) nbLines = parseInt(args[0]);
	const logs = await getLogs(nbLines);
	logMessage("```" + logs + "```", message.channel);
};

module.exports.help = {
	name: "logs",
	aliases: [],
	description: "Show bot's logs",
	usage: "logs [number of lines]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	authNeeded: "ADMINISTRATOR", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
