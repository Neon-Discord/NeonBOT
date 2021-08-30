const { errorMessage, promptMessage } = require("../../utils/infoMessages");

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
		promptMessage("Veuillez entrer le texte du giveaway", message.channel);
		return {
			wait_for_response: true,
		};
	}
};
module.exports.responding = (client, message, messageContent) => {
	message.channel.send("working ! : " + messageContent);
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
