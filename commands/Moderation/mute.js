const { db } = require("../../utils/dbInit");
const { successMessage, errorMessage } = require("../../utils/infoMessages");
const { owner_id } = require("../../config/settings.json");

module.exports.run = async (client, message, args) => {
	if (message.mentions.users.first().id == owner_id) return errorMessage("Permissions manquantes", message.channel);

	// Checks if the member was already muted
	let muted_users = db.getData("/mutedMbrs");
	if (muted_users.includes(message.mentions.users.first().id)) return errorMessage("Membre déja muet !", message.channel);

	// And mute the member
	await db.push("/mutedMbrs[]", message.mentions.users.first().id);
	successMessage(`${message.mentions.members.first()} à bien été réduit au silence !`, message.channel);
};

module.exports.help = {
	name: "mute",
	aliases: [],
	description: "Mute member",
	usage: "<command> @user", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: true,
	args: false,
};
