const { db } = require("../utils/dbInit");
const { log } = require("../utils/log");

module.exports = {
	name: "messageReactionAdd",
	once: false,
	execute: async (client, reaction, user) => {
		if (user.bot) return;
		const giveaway = db.getData("/giveaways").find((giveaway) => giveaway.msg_id == reaction.message.id);
		if (!giveaway) return;
		log(`User ${user.username} join giveaway ${giveaway.id} !`);
		db.push(`/giveaways[${db.getIndex("/giveaways", giveaway.id, "id")}]/participants[]`, user.id);
	},
};
