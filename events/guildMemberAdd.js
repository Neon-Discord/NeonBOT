const { welcome } = reqlib("/utils/settingsManager/get")();
const { log } = reqlib("/utils/log");
const { createEventMessage } = reqlib("/utils/eventMessages");

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
		createEventMessage({
			text: `Hey ${member} bienvenue sur ${member.guild.name} ! Va faire un tour sur <#${welcome.rulesChannelId}> pour prendre connaissance du règlement et profite ! `,
			imageUrl: member.user.displayAvatarURL(),
			author: member.user.username,
			color: "#3f92bf",
			footer: `Membre #${member.guild.memberCount}`,
			channel: welcome.welcomeChannel,
		});

		if (!role) return;
		setTimeout(function () {
			member.roles.add(role);
		}, 10000);
	},
};
