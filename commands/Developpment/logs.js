const { logMessage } = require("../../utils/infoMessages");
const { getLogs } = require("../../utils/log");

module.exports.run = async (client, message, args) => {
	let nbLines = 10;
	if (args.length > 0) nbLines = parseInt(args[0]);
	const logs = await getLogs(nbLines);
	logMessage("```" + logs.substring(0, 4095 - 6) + "```", message.channel);
};

module.exports.help = {
	name: "logs",
	aliases: [],
	description: "Show bot's logs",
	usage: "<command> [number of lines]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
