const { welcome } = require("../config/settings.json");
const { log } = require("../utils/log");
const { createEventMessage } = require("../utils/eventMessages");

module.exports = {
	name: "guildMemberAdd",
	once: false,
	execute: async (client, member) => {
		log("User " + member.user.tag + " has joined the server !");

		var role = member.guild.roles.cache.find((role) => role.id == welcome.welcomeRole);

		createEventMessage({
			text: `**${member} a rejoint le serveur !**`,
			imageUrl: member.user.displayAvatarURL(),
			author: member.user.username,
			color: "#3f92bf",
			footer: `Membre #${member.guild.memberCount}`,
		});

		setTimeout(function () {
			member.roles.add(role);
		}, 10000);
	},
};
