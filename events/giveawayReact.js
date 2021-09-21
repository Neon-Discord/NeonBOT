const { db } = require("../utils/dbInit");
const { errorMessagePersistent } = require("../utils/infoMessages");
const { log } = require("../utils/log");

module.exports = {
	name: "messageReactionAdd",
	once: false,
	execute: async (client, reaction, user) => {
		if (user.bot) return;
		const giveaway = db.getData("/giveaways").find((giveaway) => giveaway.msg_id == reaction.message.id);
		if (!giveaway) return;
		// Cheks if the member was banned from giveaways
		const banned_users = db.getData("/giveawaysban");
		if (banned_users.length > 0 && banned_users.includes(user.id)) {
			log(`User ${user.username} attempt to join giveaway ${giveaway.id} but is banned !`);
			const dm = await user.createDM();
			errorMessagePersistent(`Tu a été banni du giveaway sur le serveur ${reaction.message.guild.name}, tu ne peux plus y participer.`, dm);
			return reaction.users.remove(user);
		}
		// Save participation
		log(`User ${user.username} join giveaway ${giveaway.id} !`);
		db.push(`/giveaways[${db.getIndex("/giveaways", giveaway.id, "id")}]/participants[]`, user.id);
	},
};
