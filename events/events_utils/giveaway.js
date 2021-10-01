const { errorMessagePersistent } = require("../../utils/infoMessages");
const { log } = require("../../utils/log");
const { db } = require("../../utils/dbInit");

module.exports.giveawayCreate = async (client, reaction, user) => {
	// Checks if message is a giveaway
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
};

module.exports.giveawayDelete = async (client, reaction, user) => {
	// If the message is a giveaway
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
};
