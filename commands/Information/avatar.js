const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
	const targetUser = message.mentions.users.first() || message.author;
	const targetMember = message.mentions.members.first() || message.member;
	const avatarEmbed = new MessageEmbed()
		.setDescription(`**${targetUser}'s avatar :**`)
		.setImage(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
		.setFooter(`Requested by ${message.author.username}`)
		.setTimestamp()
		.setColor(targetMember.displayHexColor);
	message.channel.send({ embeds: [avatarEmbed] });
};

module.exports.help = {
	name: "avatar",
	aliases: [],
	description: "Send your or other's avatar",
	usage: "<command> [@user]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "120", // sec
	cooldownType: "user", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
