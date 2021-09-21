const { db } = require("../utils/dbInit");
const { log } = require("../utils/log");

module.exports = {
	name: "messageReactionRemove",
	once: false,
	execute: async (client, reaction, user) => {
		if (user.bot) return;
		const giveaway = db.getData("/giveaways").find((giveaway) => giveaway.msg_id == reaction.message.id);
		if (!giveaway) return;

		// Cheks if the member was banned from giveaways
		const banned_users = db.getData("/giveawaysban");
		if (banned_users.length > 0 && banned_users.includes(user.id)) return;
		// Save user leaving

		log(`User ${user.username} leave giveaway ${giveaway.id} !`);
		db.delete(
			`/giveaways[${db.getIndex("/giveaways", giveaway.id, "id")}]/participants[${db.getIndex(
				`/giveaways[${db.getIndex("/giveaways", giveaway.id, "id")}]/participants`,
				user.id
			)}]`
		);
	},
};
