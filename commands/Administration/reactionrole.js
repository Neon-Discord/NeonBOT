const { db } = reqlib("/utils/dbInit");
const { errorMessage, promptMessage, infoMessage, successMessage } = reqlib("/utils/infoMessages");
const { createEventMessage } = reqlib("/utils/eventMessages");
const { reactrole } = reqlib("/utils/settingsManager/get")();
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
	const action = args[0].toLowerCase();

	if (!args[0] || !["create", "list", "remove"].includes(action))
		return errorMessage(
			"Vous devez fournir une action à effectuer ainsi que l'ID du message concerné si nécessaire: `" +
				this.help.usage.replace("<command>", this.help.name) +
				"`",
			message.channel
		);

	// Else, if the command exists
	if (action == "create") {
		promptMessage(`Veuillez entrer les paramètres du message, \`\`\`${this.help.create_usage}\`\`\` \n\`cancel\` pour annuler`, message.channel);
		return {
			wait_for_response: true,
		};
	}
	// else if (action == "remove") {
	// 	if (!message.mentions.roles.first())
	// 		return errorMessage(
	// 			`Vous dever préciser la mention du rôle correspondant à l'infochannel à supprimer !\nExemple: \`\`\`${prefix}${this.help.name} remove @role\`\`\``,
	// 			message.channel
	// 		);

	// 	// If all is right
	// 	const current_infoch = db.getData("/infochannels");
	// 	const role = message.mentions.roles.first();
	// 	const ich_id = current_infoch.findIndex((ich) => ich.role_id == role.id);
	// 	if (ich_id == -1) return errorMessage(`Aucun infochannel pour le rôle ${role}.`, message.channel);

	// 	// If the infochannel exists
	// 	message.guild.channels.fetch(current_infoch[ich_id].ch_id).then((ch) => ch.delete());
	// 	db.delete(`/infochannels[${ich_id}]`);

	// 	successMessage(`Infochannel pour le rôle ${role.name} supprimé !`, message.channel);
	// 	createEventMessage({
	// 		title: "Infochannel supprimé !",
	// 		author: null,
	// 		text: `Elle concernait le rôle : ${role}`,
	// 		color: "#EFFF78",
	// 		footer: `Supprimé par ${message.author.username}`,
	// 	});
	// } else if (action == "list") {
	// 	const current_infoch = db.getData("/infochannels");
	// 	const fields = await Promise.all(
	// 		current_infoch.map(async (ich) => {
	// 			const channel = await message.guild.channels.fetch(ich.ch_id);
	// 			const role = await message.guild.roles.fetch(ich.role_id);
	// 			return {
	// 				name: channel.name,
	// 				value: `Compte le rôle ${role}`,
	// 			};
	// 		})
	// 	);
	// 	const ichEmbed = new MessageEmbed().setColor("#EFFF78").setTitle("Infochannels").addFields(fields).setTimestamp();
	// 	message.channel.send({ embeds: [ichEmbed] });
	// }
};

// Handle the client response
module.exports.responding = async (client, message, messageContent) => {
	if (messageContent.trim() == "cancel") return infoMessage("Création du réaction-rôle annulée !", message.channel);
	if (!message.mentions.roles.first()) {
		errorMessage(
			`Veuillez entrer au moins une mention de **@role** !\nExemple:\`\`\`${this.help.create_usage}\`\`\`\n\`cancel\` pour annuler`,
			message.channel
		);
		return {
			wait_for_response: true,
		};
	} else if (messageContent.indexOf("//") == -1) {
		errorMessage(`Forme invalide, veuillez suivre l'exemple:\`\`\`${this.help.create_usage}\`\`\`\n\`cancel\` pour annuler`, message.channel);
		return {
			wait_for_response: true,
		};
	}

	const props_arr = messageContent.split(/\n+/);
	const separator_count = (messageContent.match(/\/\//g) || []).length; // Find '//' in input
	const mentions_len = message.mentions.roles.size;
	if (separator_count != props_arr.length || mentions_len != props_arr.length) {
		errorMessage(
			`Forme invalide, veuillez suivre l'exemple suivant et vérifier que les rôles mentionnés soient différents:\`\`\`${this.help.create_usage}\`\`\`\n\`cancel\` pour annuler`,
			message.channel
		);
		return {
			wait_for_response: true,
		};
	}

	let reactions_list = [];
	let embed_text = "";
	let rr_data = [];
	let errs = false;
	const role_mentions = Array.from(message.mentions.roles.values()).reverse();

	// Loop each lines
	for (let i = 0; i < props_arr.length; i++) {
		const entry = props_arr[i];
		const entry_arr = entry.split("//");
		if (!emo_test(entry_arr[1])) errs = true;
		rr_data.push({
			emoji: entry_arr[1],
			role: role_mentions[i].id,
		});
		reactions_list.push(entry_arr[1]);
		embed_text += `${entry_arr[0]}\n`;
	}

	if (errs) {
		errorMessage(
			`Forme invalide, veuillez fournir des emojis courants:\`\`\`${this.help.create_usage}\`\`\`\n\`cancel\` pour annuler`,
			message.channel
		);
		return {
			wait_for_response: true,
		};
	}

	const rrEmbed = new MessageEmbed()
		.setColor(reactrole.embedColor)
		.setTitle("Réaction-rôle")
		.setDescription(embed_text)
		.setFooter(`Created by ${message.author.username}`)
		.setTimestamp();
	const sent_message = await message.channel.send({ embeds: [rrEmbed] });
	reactions_list.forEach((emoji) => {
		sent_message.react(emoji);
	});

	// Generate the id of the rr message
	let id = 111;
	try {
		id = db.getData("/reactroles[-1]/id") + 1;
	} catch (error) {
		console.log("First reactrole");
	}

	db.push("/reactroles[]", {
		id: id,
		msg_id: sent_message.id,
		rr_data: rr_data,
	});

	successMessage(`Reaction-rôle créé !\nSon id est \`${id}\``, message.channel);

	// createEventMessage({
	// 	title: "Nouvel infochannel",
	// 	author: null,
	// 	text: `Infochannel créé par ${message.author} : ${createdChannel}`,
	// 	color: "#EFFF78",
	// 	footer: `Crée par ${message.author.username}`,
	// });
	// successMessage(`Nouvel infochannel crée pour le role ${role} comportant ${count} utilisateurs.`, message.channel);
};

var emoji_regex =
	/^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

const emo_test = (str) => {
	return emoji_regex.test(str);
};

module.exports.help = {
	name: "reactionrole",
	aliases: ["rr"],
	description: "Create a reaction-role message",
	usage: "<command> create", // '[]' for not necessary args and '||' for OR symbol
	create_usage: "Pour avoir le role @role, réact 😎//😎\nPour role @anotherrole, réact 👍//👍",
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: false,
	args: true,
};
