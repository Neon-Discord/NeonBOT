const { logs } = require("../config/settings.json");
const { MessageEmbed } = require("discord.js");
const { fetchChannel } = require("./fetchChannel");
const { client } = require("../main");

// @param config = {text, imageUrl, color, footer, author}
// @param client = the discord.js client
module.exports.createEventMessage = (config) => {
	if (!config.text) return;
	imageUrl = config.imageUrl || client.user.defaultAvatarURL;
	const eventEmbed = new MessageEmbed()
		.setColor(config.color || "#43464a")
		.setAuthor(config.author || `${client.user.username} event message`, imageUrl)
		.setThumbnail(imageUrl)
		.setDescription(config.text)
		.setTimestamp()
		.setFooter(config.footer || client.user.username);

	fetchChannel(config.channel || logs.logsChannel).then((channel) => channel.send({ embeds: [eventEmbed] }));
};
