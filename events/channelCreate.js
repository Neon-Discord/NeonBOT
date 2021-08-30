const { welcome } = require("../config/settings.json");
const { log } = require("../utils/log");
const { createEventMessage } = require("../utils/eventMessages");

module.exports = {
	name: "channelCreate",
	once: false,
	execute: async (client, channel) => {
		log(`New channel created: ${channel}`);

		createEventMessage({
			text: `**New channel created: ${channel} !**`,
			color: "#3f92bf",
			footer: `${channel.type.replace("GUILD_", "")} channel`,
		});
	},
};
