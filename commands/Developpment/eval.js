const settings = require("../../config/settings.json");
const { logMessage } = require("../../utils/infoMessages");

module.exports.run = async (client, message, args) => {
	const expr = args.join(" ");
	if (expr.includes("token") || expr.includes("config") || expr.includes("os") || expr.includes("system")) return;
	const result = eval(expr);
	let text;
	if (typeof result == "boolean") text = result ? "true" : "false";
	else if (typeof result == "object" || typeof result == "array") text = JSON.stringify(result);
	else text = result.toString();
	logMessage(text || "The command has ne result", message.channel);
};

module.exports.help = {
	name: "eval",
	aliases: [],
	description: "Eval the script in args",
	usage: "<command> expression", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	authNeeded: "ADMINISTRATOR", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: true,
};
