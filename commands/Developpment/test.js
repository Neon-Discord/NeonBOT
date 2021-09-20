const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { createEventMessage } = require("../../utils/eventMessages");

module.exports.run = async (client, message, args) => {
	const avatarEmbed = new MessageEmbed().setImage(
		client.user.displayAvatarURL({
			dynamic: true,
		})
	);
	message.channel.send(client.user.defaultAvatarURL);
	// const rows = [];
	// rows.push(
	// 	new MessageActionRow().addComponents(
	// 		new MessageButton().setCustomId("primary").setLabel("J'ai compris !").setStyle("PRIMARY")
	// 	)
	// );
	// rows.push(
	// 	new MessageActionRow().addComponents(
	// 		new MessageButton().setCustomId("sec").setLabel("J'ai compris !").setStyle("SECONDARY")
	// 	)
	// );
	// rows.push(
	// 	new MessageActionRow().addComponents(
	// 		new MessageButton().setCustomId("suc").setLabel("J'ai compris !").setStyle("SUCCESS")
	// 	)
	// );
	// rows.push(
	// 	new MessageActionRow().addComponents(
	// 		new MessageButton().setCustomId("dng").setLabel("J'ai compris !").setStyle("DANGER")
	// 	)
	// );
	// rows.push(
	// 	new MessageActionRow().addComponents(
	// 		new MessageButton().setLabel("J'ai compris !").setStyle("LINK").setURL("http://google.fr")
	// 	)
	// );
	// message.channel.send({ content: "It works !", components: rows });
};

module.exports.help = {
	name: "test",
	aliases: [],
	description: "Just a test",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	authNeeded: "ADMINISTRATOR", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
