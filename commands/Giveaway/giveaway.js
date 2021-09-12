const settings = require("../../config/settings.json");
const { fetchChannel } = require("../../utils/fetchChannel");
const { db } = require("../../utils/dbInit");
const { errorMessage, promptMessage, infoMessage } = require("../../utils/infoMessages");
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
		if (args.length < 2 || args[1].length != 3)
			return errorMessage(`Vous devez passer en argument l'ID du giveaway concerné`, message.channel);
		const giv_id = db.getIndex("/giveaways", parseInt(args[1]), "id");
		if (giv_id == -1)
			// default search based on the id parameter
			return errorMessage("Veuillez saisir un ID de message valide !", message.channel);
		const giveaway = db.getData(`/giveaways[${giv_id}]`);
		const users = giveaway.participants;
		const guild = client.guilds.cache.find((g) => g.id == settings.guildId);

		if (users.length < 1) return errorMessage("Aucun utilisateur n'a participé à ca giveaway !", message.channel);
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
		log(`Giveaway closed: ${giveaway.id}`);
		db.delete(`/giveaways[${giv_id}]`);
	} else if (action == "list") {
		const giveaways_list = db.getData("/giveaways");
		if (giveaways_list.length < 1)
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(settings.giveaways.embedListColor)
						.setDescription(`Il n'y a aucun giveaway d'ouvert !`),
				],
			});
		const fields = giveaways_list.map((giv) => {
			return {
				name: giv.gift,
				value: `${giv.id} | ${giv.dlDate || "none"}`,
			};
		});
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(settings.giveaways.embedListColor)
					.setTitle("Liste des giveaways ouverts")
					.addFields(fields),
			],
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
				.setFooter(`ÌD: ${id}`),
		],
	});
	sent_msg.react(giv_array[1]);
	db.push("/giveaways[]", {
		id: id,
		msg_id: sent_msg.id,
		gift: giv_array[0],
		participants: [],
	});
	console.log(db.getData("/giveaways"));
};
module.exports.help = {
	name: "giveaway",
	aliases: [],
	description: "Create, list or finish giveaways",
	usage: "<command> create||list||finish [id]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "1", // sec
	cooldownType: "command", // 'user' || 'command'
	authNeeded: "ADMINISTRATOR", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: true,
};
