module.exports = {
	name: "interactionCreate",
	once: false,
	execute: async (client, interaction) => {
		if (interaction.isButton() && interaction.customId === "close") {
			interaction.message.delete();
		}
	},
};
