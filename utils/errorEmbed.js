const { errorMessagesDeleteAfter } = require("../config/settings.json");
const { MessageEmbed } = require("discord.js");

module.exports = async (text, message) => {
	return message.channel
		.send({
			embeds: [new MessageEmbed().setColor("#e6494f").setDescription(text)],
		})
		.then((sentMessage) =>
			setTimeout(() => {
				sentMessage.delete();
			}, errorMessagesDeleteAfter)
		);
};
