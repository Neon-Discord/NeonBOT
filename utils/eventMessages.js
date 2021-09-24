const { logs } = require("../config/settings.json");
const { MessageEmbed } = require("discord.js");
const { fetchChannel } = require("./fetchChannel");
const { client } = require("../main");

// @param config = {channel, text, imageUrl, color, footer, author}
module.exports.createEventMessage = (config) => {
	if (!config.text) return;
	imageUrl = config.imageUrl || client.user.displayAvatarURL();
	let eventEmbed = new MessageEmbed()
		.setColor(config.color || "#43464a")
		.setDescription(config.text)
		.setTimestamp()
		.setFooter(config.footer || client.user.username);

	if (!config.author == null) eventEmbed.setAuthor(config.author || `${client.user.username} event message`);
	if (config.title) eventEmbed.setTitle(config.title);
	if (config.imageUrl) eventEmbed.setThumbnail(config.imageUrl);

	fetchChannel(config.channel || logs.logsChannel).then((channel) => channel.send({ embeds: [eventEmbed] }));
};
