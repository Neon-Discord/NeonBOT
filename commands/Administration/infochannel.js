const { db } = require("../../utils/dbInit");
const { errorMessage, promptMessage, infoMessage } = require("../../utils/infoMessages");

module.exports.run = async (client, message, args) => {
	const action = args[0].toLowerCase();

	if (!args[0] || !["create", "list", "finish"].includes(action))
		return errorMessage(
			"Vous devez fournir une action à effectuer ainsi que l'ID du giveaway si nécessaire: `" +
				this.help.usage.replace("<command>", this.help.name) +
				"`",
			message.channel
		);

	// Else, if the command exists
	if (action == "create") {
		promptMessage("Veuillez entrer la mention du role à compter.\n`cancel` pour annuler", message.channel);
		return {
			wait_for_response: true,
		};
	}
};

// Handle the client response
module.exports.responding = async (client, message, messageContent) => {
	if (messageContent.trim() == "cancel") return infoMessage("Création de l'infochannel annulée !", message.channel);
	if (!message.mentions.roles.first()) {
		errorMessage("Veuillez entrer une mention de **@role** !\n`cancel` pour annuler", message.channel);
		return {
			wait_for_response: true,
		};
	}

	const current_infoch = db.getData("/infochannels");
	const role = message.mentions.roles.first();

	if (current_infoch.length && current_infoch.findIndex((ich) => ich.role_id == role.id) > -1) {
		errorMessage(`Infochannel déja crée pour le role ${role} !\nEssayez-en un autre.\n\`cancel\` pour annuler`, message.channel);
		return {
			wait_for_response: true,
		};
	}

	const count = message.mentions.roles.first().members.size;

	const everyoneRole = message.guild.roles.cache.find((r) => r.name === "@everyone");
	message.guild.channels
		.create(`ℹ | ${role.name} : ${count}`, {
			type: "GUILD_VOICE",
			userLimit: 0,
			parent: "888866727667040314",
			permissionOverwrites: [
				{
					id: everyoneRole.id,
					deny: ["CONNECT"],
					count: count,
				},
			],
		})
		.then((createdChannel) => {
			db.push("/infochannels[]", {
				ch_id: createdChannel.id,
				role_id: role.id,
			});
		});

	message.channel.send(`${role}: ${count}`);
};

module.exports.help = {
	name: "infochannel",
	aliases: [],
	description: "Create infochannels",
	usage: "<command> create", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: false,
	args: true,
};
