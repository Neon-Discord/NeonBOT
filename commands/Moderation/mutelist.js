const { MessageEmbed } = require("discord.js");
const { db } = require("../../utils/dbInit");
const { successMessage, errorMessage, infoMessage } = require("../../utils/infoMessages");
const { prefix } = require("../../config/settings.json");

module.exports.run = async (client, message, args) => {
	const muted_users = db.getData("/mutedMbrs");
	if (muted_users.length == 0) return infoMessage("Aucun utilisateur muet !", message.channel);

	let fieldsList = [];
	await muted_users.forEach(async (userid) => {
		const member = await message.guild.members.fetch(userid);
		fieldsList.push({
			name: member.user.username,
			value: `${prefix}unmute <@${userid}>`,
			inline: true,
		});
	});

	const mutedEmbed = new MessageEmbed().setTitle("Membres muets").addFields(fieldsList).setTimestamp().setThumbnail(client.user.displayAvatarURL());
	message.channel.send({ embeds: [mutedEmbed] });
};

module.exports.help = {
	name: "mutelist",
	aliases: [],
	description: "List all members muted",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: false,
	args: false,
};
