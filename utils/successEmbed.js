const { errorMessagesDeleteAfter } = require("../config/settings.json");
const { MessageEmbed } = require("discord.js");

module.exports = async (text, message) => {
	return message.channel.send({
		embeds: [new MessageEmbed().setColor("#41f04f").setDescription(text)],
	});
};
