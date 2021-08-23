module.exports.run = async (client, message, args) => {
	message.channel.send("It works !");
};

module.exports.help = {
	name: "test",
	aliases: [],
	description: "Just a test",
	usage: "test", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	authNeeded: "ADMINISTRATOR", // eg. KICK_MEMBERS
	delete: true,
	mention: true,
	args: true,
};
