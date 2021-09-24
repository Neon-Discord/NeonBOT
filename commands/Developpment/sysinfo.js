const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
	const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
	arr.reverse();
	const used = process.memoryUsage().heapUsed / 1024 / 1024;
	const cpu_usage = process.cpuUsage();

	const sysinfoEmbed = new MessageEmbed()
		.setAuthor("System info", client.user.displayAvatarURL())
		.addFields([
			{
				name: "Memory usage",
				value: `~ ${Math.round(used * 100) / 100} MB`,
			},
		])
		.setTimestamp();
	message.channel.send({ embeds: [sysinfoEmbed] });
};

module.exports.help = {
	name: "sysinfo",
	aliases: [],
	description: "Get system infos",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
