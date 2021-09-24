const { logMessage } = require("../../utils/infoMessages");
const { getCmdHistory } = require("../../utils/cmdHistory");

module.exports.run = async (client, message, args) => {
	let nbLines = 10;
	if (args.length > 0) nbLines = parseInt(args[0]);
	const logs = await getCmdHistory(nbLines);
	logMessage("```" + logs.substring(0, 4095 - 6) + "```", message.channel);
};

module.exports.help = {
	name: "cmdlogs",
	aliases: ["cmdhistory", "cmdhist"],
	description: "Show bot's command history",
	usage: "<command> [number of lines]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
