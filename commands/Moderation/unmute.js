const { db } = require("../../utils/dbInit");
const { successMessage, errorMessage } = require("../../utils/infoMessages");

module.exports.run = async (client, message, args) => {
	let muted_users = db.getData("/mutedMbrs");
	if (!muted_users.length > 0 || !muted_users.includes(message.mentions.users.first().id))
		return errorMessage(`L'utilisateur ${message.mentions.users.first()} n'est pas muet.`, message.channel);

	db.delete(`/mutedMbrs[${muted_users.findIndex((item) => item == message.mentions.users.first().id)}]`);
	successMessage(`${message.mentions.members.first()} à bien été enlevé de la liste !`, message.channel);
};

module.exports.help = {
	name: "unmute",
	aliases: [],
	description: "Unmute member",
	usage: "<command> @user", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: true,
	args: false,
};
