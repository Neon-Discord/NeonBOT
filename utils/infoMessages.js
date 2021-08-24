const { errorMessagesDeleteAfter } = require("../config/settings.json");
const { MessageEmbed } = require("discord.js");

module.exports.errorMessage = async (text, channel) => {
	return channel
		.send({
			embeds: [new MessageEmbed().setColor("#e6494f").setDescription(text)],
		})
		.then((sentMessage) =>
			setTimeout(() => {
				sentMessage.delete();
			}, errorMessagesDeleteAfter)
		);
};
module.exports.errorMessagePersistent = async (text, channel) => {
	return channel.send({
		embeds: [new MessageEmbed().setColor("#e6494f").setDescription(text)],
	});
};
module.exports.successMessage = async (text, channel) => {
	return channel.send({
		embeds: [new MessageEmbed().setColor("#41f04f").setDescription(text)],
	});
};
module.exports.infoMessage = async (text, channel) => {
	return channel.send({
		embeds: [new MessageEmbed().setColor("#2d57ba").setDescription(text)],
	});
};

module.exports.logMessage = async (text, channel) => {
	return channel.send({
		embeds: [new MessageEmbed().setColor("#43464a").setDescription(text)],
	});
};
