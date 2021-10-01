const { giveawayDelete } = require("./events_utils/giveaway");
const { rrDelete } = require("./events_utils/reactrole");

module.exports = {
	name: "messageReactionRemove",
	once: false,
	execute: async (client, reaction, user) => {
		// No bots
		if (user.bot) return;
		giveawayDelete(client, reaction, user);
		rrDelete(client, reaction, user);
	},
};
