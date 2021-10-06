const { errorMessagePersistent } = reqlib("/utils/infoMessages");
const { log } = reqlib("/utils/log");
const { db } = reqlib("/utils/dbInit");

module.exports.rrCreate = async (client, reaction, user) => {
	// Checks if message is a giveaway
	const reactrole = db.getData("/reactroles").find((rr) => rr.msg_id == reaction.message.id);
	if (!reactrole) return;

	const db_role = reactrole.rr_data.find((r) => r.emoji == reaction.emoji.name);
	const role = await reaction.message.guild.roles.fetch(db_role.role);

	log(`${user.username} reacted to reaction-role ${reactrole.id} with ${reaction.emoji.name}.`);

	const reaction_member = await reaction.message.guild.members.fetch(user.id);
	if (reaction_member.roles.cache.has(role.id)) return;

	log(`He join the role: ${role.name}`);

	reaction_member.roles.add(role.id);
};

module.exports.rrDelete = async (client, reaction, user) => {
	// Checks if message is a giveaway
	const reactrole = db.getData("/reactroles").find((rr) => rr.msg_id == reaction.message.id);
	if (!reactrole) return;

	const db_role = reactrole.rr_data.find((r) => r.emoji == reaction.emoji.name);
	const role = await reaction.message.guild.roles.fetch(db_role.role);

	log(`${user.username} unreacted to reaction-role ${reactrole.id}, removing ${reaction.emoji.name}.`);

	const reaction_member = await reaction.message.guild.members.fetch(user.id);
	if (!reaction_member.roles.cache.has(role.id)) return;

	log(`He left the role: ${role.name}`);

	reaction_member.roles.remove(role.id);
};
