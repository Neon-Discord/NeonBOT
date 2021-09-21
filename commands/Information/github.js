const { MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args) => {
	const link_btn = new MessageActionRow().addComponents(
		new MessageButton().setLabel("Y aller !").setStyle("LINK").setURL("http://github.com/Neon-Discord/NeonBOT")
	);
	message.channel.send({ content: "Github repository:", components: [link_btn] });
};

module.exports.help = {
	name: "github",
	aliases: [],
	description: "Return the bot's GitHub repository",
	usage: "<command>", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "0", // sec
	cooldownType: "", // 'user' || 'command'
	authNeeded: "", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
