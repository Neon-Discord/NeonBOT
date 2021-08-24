module.exports = {
	name: "interactionCreate",
	once: false,
	execute(client, interaction) {
		if (interaction.isButton() && interaction.customId === "close") {
			interaction.message.delete();
		}
	},
};
