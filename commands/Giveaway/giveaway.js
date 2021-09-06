const settings = require("../../config/settings.json");
const { fetchChannel } = require("../../utils/fetchChannel");
const { db } = require("../../utils/dbInit");
const { errorMessage, promptMessage, infoMessage } = require("../../utils/infoMessages");

// To the fetching section, see the ready event

module.exports.run = async (client, message, args) => {
	const action = args[0].toLowerCase();
	if (!args[0] || !["create", "delete", "update", "finish"].includes(action))
		return errorMessage(
			"Vous devez fournir une action à effectuer ainsi que l'ID du giveaway si nécessaire: `" +
				this.help.usage.replace("<command>", this.help.name) +
				"`",
			message.channel
		);
	// Else, if the command exists
	if (action == "create") {
		promptMessage(
			"Veuillez entrer le texte du giveaway suivi de `||` et de l'emoji à mettre en réaction.\nEg. ```Réagissez 👍 pour participer au giveaway||👍```\n`cancel` pour annuler",
			message.channel
		);
		return {
			wait_for_response: true,
		};
	}
};
module.exports.responding = async (client, message, messageContent) => {
	if (messageContent.trim() == "cancel") return infoMessage("Création du giveaway annulée !", message.channel);
	giv_array = messageContent.split("||");
	if (!giv_array.length == 2 || giv_array[0].length < 1 || !giv_array[1] || !giv_array[1].length == 1) {
		promptMessage(
			"Forme invalide, veuillez suivre l'exemple donné :\n ```Réagissez 👍 pour participer au giveaway||👍```\nVous pouvez aussi taper `cancel` pour annuler",
			message.channel
		);
		return {
			wait_for_response: true,
		};
	}

	const giv_channel = await fetchChannel(settings.giveaways.channelId);
	const sent_msg = await giv_channel.send(giv_array[0]);
	sent_msg.react(giv_array[1]);
	db.push("/giveaways[]", {
		id: sent_msg.id,
		participants: [],
	});
	console.log(db.getData("/giveaways"));
};
module.exports.help = {
	name: "giveaway",
	aliases: [],
	description: "Create, update or delete a giveaway",
	usage: "<command> create||update||delete||finish [id]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	authNeeded: "ADMINISTRATOR", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: true,
};
