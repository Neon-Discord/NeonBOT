const { owner_id } = require("../../config/settings.json");
const { db } = require("../../utils/dbInit");
const { errorMessage, successMessage } = require("../../utils/infoMessages");

// To the fetching section, see the ready event

module.exports.run = async (client, message, args) => {
	if (message.mentions.users.first().id == owner_id) return errorMessage("Permissions manquantes !", message.channel);

	if (db.getData("/giveawaysban").includes(message.mentions.users.first().id))
		return errorMessage(`Cet utilisateur à déja été banni des giveaways !`, message.channel);
	db.push("/giveawaysban[]", message.mentions.users.first().id);
	successMessage(`<@${message.mentions.users.first().id}> à bien été banni des giveaways !`, message.channel);
};
module.exports.help = {
	name: "giveawayban",
	aliases: [],
	description: "Ban user from giveaway",
	usage: "<command> create||list||finish [id]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "1", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: true,
	args: false,
};
