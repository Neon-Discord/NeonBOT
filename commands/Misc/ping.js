module.exports.run = async (client, message, args) => {
	message.channel.send(`${client.user.tag} is up !`);
};

module.exports.help = {
	name: "ping",
	aliases: [],
	description: "Resend pong !",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
