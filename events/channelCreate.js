const { welcome } = reqlib("/utils/settingsManager/get")();
const { log } = reqlib("/utils/log");
const { createEventMessage } = reqlib("/utils/eventMessages");

module.exports = {
	name: "channelCreate",
	once: false,
	execute: async (client, channel) => {
		log(`New channel created: ${channel.name}`);

		const chType = channel.type.replace("GUILD_", "").toLowerCase();
		const chName = chType.slice(0, 1).toUpperCase() + chType.substring(1);
		createEventMessage({
			author: "Nouveau salon",
			text: `Nouveau salon créé : ${channel} !`,
			color: "#3f92bf",
			footer: `${chName} channel`,
		});
	},
};
