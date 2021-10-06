const { giveawayDelete } = reqlib("/events/events_utils/giveaway");
const { rrDelete } = reqlib("/events/events_utils/reactrole");

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
