module.exports.run = async (client, message, args) => {
	if (args.length > 0) message.channel.send(args.join(" "));
};

module.exports.help = {
	name: "echo",
	aliases: ["say", "repeat"],
	description: "Resend your message",
	usage: "<command> <message>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	delete: true,
	mention: false,
	args: true,
};
