const { welcome } = reqlib("/utils/settingsManager/get")();
const { log } = reqlib("/utils/log");
const { createEventMessage } = reqlib("/utils/eventMessages");

module.exports = {
	name: "guildMemberRemove",
	once: false,
	execute: async (client, member) => {
		log("User " + member.user.tag + " left the server !");

		createEventMessage({
			text: `**${member} a quitté le serveur !**`,
			imageUrl: member.user.displayAvatarURL(),
			author: member.user.username,
			color: "#D9000C",
			footer: `Membres: ${member.guild.memberCount}`,
		});
	},
};
