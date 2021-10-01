const settings = require("../../config/settings.json");
const { fetchChannel } = require("../../utils/fetchChannel");
const { db } = require("../../utils/dbInit");
const { errorMessage, promptMessage, infoMessage, successMessage } = require("../../utils/infoMessages");
const { MessageEmbed } = require("discord.js");
const { log } = require("../../utils/log");

// To the fetching section, see the ready event

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
		promptMessage(
			"Veuillez entrer la récompense du giveaway suivi de `||` et de l'emoji à mettre en réaction.\nEg. ```Un abonnement nitro 1 an||👍```\n`cancel` pour annuler",
			message.channel
		);
		return {
			wait_for_response: true,
		};
	} else if (action == "finish") {
		if (args.length < 2 || args[1].length != 3) return errorMessage(`Vous devez passer en argument l'ID du giveaway concerné`, message.channel);
		const giv_id = db.getIndex("/giveaways", parseInt(args[1]), "id");
		if (giv_id == -1)
			// default search based on the id parameter
			return errorMessage("Veuillez saisir un ID de giveaway valide !", message.channel);
		const giveaway = db.getData(`/giveaways[${giv_id}]`);
		const users = giveaway.participants;
		const guild = client.guilds.cache.find((g) => g.id == settings.guildId);

		if (users.length < 1) return errorMessage("Aucun utilisateur n'a participé à ce giveaway !", message.channel);
		let winner = guild.members.cache.get(users[Math.floor(Math.random() * users.length)]);
		while (!winner) {
			winner = guild.members.cache.get(users[Math.floor(Math.random() * users.length)]);
		}
		const winnerEmbed = new MessageEmbed()
			.setColor(settings.giveaways.embedWinColor)
			.setTitle("Giveaway terminé !")
			.setDescription(`Le gagnant est ${winner} !`)
			.addField("Il remporte: ", `${giveaway.gift}`)
			.setFooter(`${users.length} Participant(s)`)
			.setTimestamp();
		const giv_channel = await fetchChannel(settings.giveaways.channelId);
		giv_channel.send({ embeds: [winnerEmbed] });
		giv_channel.messages.fetch(giveaway.msg_id).then((msg) => msg.reactions.removeAll());

		giv_channel.messages.edit(giveaway.msg_id, {
			embeds: [
				new MessageEmbed()
					.setAuthor("Giveaway terminé !")
					.setDescription(`**${winner} à gagné ce giveaway !**`)
					.setFooter(`${users.length} Participant(s)`),
			],
		});
		db.delete(`/giveaways[${giv_id}]`);

		successMessage(`Giveaway \`${args[1]}\` terminé !`, message.channel);
		log(`Giveaway closed: ${giveaway.id}`);
	} else if (action == "list") {
		const giveaways_list = db.getData("/giveaways");
		if (giveaways_list.length < 1)
			return message.channel.send({
				embeds: [new MessageEmbed().setColor(settings.giveaways.embedListColor).setDescription(`Il n'y a aucun giveaway d'ouvert !`)],
			});
		const fields = giveaways_list.map((giv) => {
			return {
				name: giv.gift,
				value: `${giv.id} | ${giv.dlDate || "none"}`,
			};
		});
		message.channel.send({
			embeds: [new MessageEmbed().setColor(settings.giveaways.embedListColor).setTitle("Liste des giveaways ouverts").addFields(fields)],
		});
	}
};

// Handle the client response
module.exports.responding = async (client, message, messageContent) => {
	if (messageContent.trim() == "cancel") return infoMessage("Création du giveaway annulée !", message.channel);
	giv_array = messageContent.split("||");
	if (!giv_array.length == 2 || giv_array[0].length < 1 || !giv_array[1] || !giv_array[1].length == 1) {
		promptMessage(
			"Forme invalide, veuillez suivre l'exemple donné :\n ```Un abonnement nitro 1 an||👍```\nVous pouvez aussi taper `cancel` pour annuler",
			message.channel
		);
		return {
			wait_for_response: true,
		};
	}
	if (!emo_test(giv_array[1])) {
		promptMessage(
			"Forme invalide, veuillez suivre l'exemple donné :\n ```Un abonnement nitro 1 an||👍```\nVous pouvez aussi taper `cancel` pour annuler",
			message.channel
		);
		return {
			wait_for_response: true,
		};
	}

	const giv_channel = await fetchChannel(settings.giveaways.channelId);
	let id = 111;
	try {
		id = db.getData("/giveaways[-1]/id") + 1;
	} catch (error) {
		console.log("First giveaway");
	}
	const sent_msg = await giv_channel.send({
		embeds: [
			new MessageEmbed()
				.setAuthor("Giveaway")
				.setDescription(`Crée par ${message.author}`)
				.addField(`Réact ${giv_array[1]} pour gagner:`, giv_array[0])
				.setFooter(`ID: ${id}`),
		],
	});
	sent_msg.react(giv_array[1]);
	db.push("/giveaways[]", {
		id: id,
		msg_id: sent_msg.id,
		gift: giv_array[0],
		participants: [],
	});
	successMessage(`Giveaway crée !\nSon id est \`${id}\``, message.channel);
};

const emoji_regex =
	/^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

const emo_test = (str) => {
	return emoji_regex.test(str);
};

module.exports.help = {
	name: "giveaway",
	aliases: [],
	description: "Create, list or finish giveaways",
	usage: "<command> create||list||finish [id]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "1", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: false,
	args: true,
};
