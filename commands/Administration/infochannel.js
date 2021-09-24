const { db } = require("../../utils/dbInit");
const { errorMessage, promptMessage, infoMessage, successMessage } = require("../../utils/infoMessages");
const { createEventMessage } = require("../../utils/eventMessages");
const { prefix } = require("../../config/settings.json");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
	const action = args[0].toLowerCase();

	if (!args[0] || !["create", "list", "remove"].includes(action))
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
	} else if (action == "remove") {
		if (!message.mentions.roles.first())
			return errorMessage(
				`Vous dever préciser la mention du rôle correspondant à l'infochannel à supprimer !\nExemple: \`\`\`${prefix}${this.help.name} remove @role\`\`\``,
				message.channel
			);

		// If all is right
		const current_infoch = db.getData("/infochannels");
		const role = message.mentions.roles.first();
		const ich_id = current_infoch.findIndex((ich) => ich.role_id == role.id);
		if (ich_id == -1) return errorMessage(`Aucun infochannel pour le rôle ${role}.`, message.channel);

		// If the infochannel exists
		message.guild.channels.fetch(current_infoch[ich_id].ch_id).then((ch) => ch.delete());
		db.delete(`/infochannels[${ich_id}]`);

		successMessage(`Infochannel pour le rôle ${role.name} supprimé !`, message.channel);
		createEventMessage({
			title: "Infochannel supprimé !",
			author: null,
			text: `Elle concernait le rôle : ${role}`,
			color: "#EFFF78",
			footer: `Supprimé par ${message.author.username}`,
		});
	} else if (action == "list") {
		const current_infoch = db.getData("/infochannels");
		const fields = await Promise.all(
			current_infoch.map(async (ich) => {
				const channel = await message.guild.channels.fetch(ich.ch_id);
				const role = await message.guild.roles.fetch(ich.role_id);
				return {
					name: channel.name,
					value: `Compte le rôle ${role}`,
				};
			})
		);
		const ichEmbed = new MessageEmbed().setColor("#EFFF78").setTitle("Infochannels").addFields(fields).setTimestamp();
		message.channel.send({ embeds: [ichEmbed] });
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
			createEventMessage({
				title: "Nouvel infochannel",
				author: null,
				text: `Infochannel créé par ${message.author} : ${createdChannel}`,
				color: "#EFFF78",
				footer: `Crée par ${message.author.username}`,
			});
			successMessage(`Nouvel infochannel crée pour le role ${role} comportant ${count} utilisateurs.`, message.channel);
		});
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
