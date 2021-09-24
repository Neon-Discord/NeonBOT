module.exports.run = async (client, message, args) => {
	let date = new Date(client.readyDate).toLocaleString("fr-FR");
	message.channel.send("Up since " + date);
};

module.exports.help = {
	name: "uptime",
	aliases: ["up", "upt"],
	description: "Show bot's uptime",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
