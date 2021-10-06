const { giveawayCreate } = reqlib("/events/events_utils/giveaway");
const { rrCreate } = reqlib("/events/events_utils/reactrole");

module.exports = {
	name: "messageReactionAdd",
	once: false,
	execute: async (client, reaction, user) => {
		// Not a bot
		if (user.bot) return;

		// Handle
		giveawayCreate(client, reaction, user);
		rrCreate(client, reaction, user);
	},
};
