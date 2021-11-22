const { guildId, owner_id } = reqlib("/utils/settingsManager/get")();

module.exports.run = async (client) => {
	const guild = await client.guilds.fetch(guildId);
	const otherMe = await guild.members.fetch(owner_id);
	console.log(otherMe);
};
