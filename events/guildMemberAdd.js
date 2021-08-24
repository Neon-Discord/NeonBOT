const { welcome } = require("../config/settings.json");
const { log } = require("../utils/log");
const { infoMessage } = require("../utils/infoMessages");

module.exports = {
	name: "guildMemberAdd",
	once: false,
	execute(client, member) {
		log("User" + member.user.tag + " has joined the server!");

		var role = member.guild.roles.cache.find((role) => role.id == welcome.welcomeRole);

		infoMessage(
			`${member} A rejoint le serveur !`,
			member.guild.channels.cache.find((ch) => ch.id == welcome.welcomeChannel)
		);

		setTimeout(function () {
			member.roles.add(role);
		}, 10000);
	},
};
