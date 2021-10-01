const { welcome } = require("../config/settings.json");
const { log } = require("../utils/log");
const { createEventMessage } = require("../utils/eventMessages");

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
