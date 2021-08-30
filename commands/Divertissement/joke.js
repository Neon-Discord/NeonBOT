const config = require("../../config/config.json");
var oneLinerJoke = require("one-liner-joke");

// Checks if the token is set
let disable_fr = false;
let blagues = null;
if (config.blagues_api_token) {
	const BlaguesAPI = require("blagues-api");
	blagues = new BlaguesAPI(config.blagues_api_token);
} else {
	disable_fr = true;
}

const { infoMessage, errorMessage } = require("../../utils/infoMessages");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
	if (args.length > 0 && args[0].toLowerCase() == "en") {
		var joke = oneLinerJoke.getRandomJoke();
		return infoMessage(`${joke.body}\n||\`${joke.tags.join(", ")}\`||`, message.channel);
	}
	if (disable_fr)
		return errorMessage(
			"Cette fonctionnalité ne peut être utilisé car l'administrateur chargé de la gestion du BOT n'a pas initialisé le token d'acces à BlaguesAPI, merci de votre comprehension (TIP: essayer avec l'argument `en`)",
			message.channel
		);

	if (args.length > 0 && ["GLOBAL", "DEV", "DARK", "LIMIT", "BEAUF", "BLONDES"].includes(args[0].toUpperCase())) {
		const catJoke = await blagues.randomCategorized(blagues.categories[args[0].toUpperCase()]);
		return this.sendJoke(catJoke, message.channel);
	}
	const randomJoke = await blagues.random();
	console.log(randomJoke);
	return this.sendJoke(randomJoke, message.channel);
};

module.exports.sendJoke = (jokeObj, channel) => {
	const jokeEmbed = new MessageEmbed()
		.setAuthor("Blague " + jokeObj.type, channel.client.user.displayAvatarURL())
		.setDescription(`${jokeObj.joke}\n${jokeObj.answer}`)
		.setFooter("Id: " + jokeObj.id);
	channel.send({ embeds: [jokeEmbed] });
};

module.exports.responding = (client, message, messageContent) => {
	message.channel.send("working ! : " + messageContent);
};
module.exports.help = {
	name: "joke",
	aliases: ["j"],
	description: "Tell a joke",
	usage: "<command> [categorie: GLOBAL | DEV | DARK | LIMIT | BEAUF | BLONDES] || [en]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "user", // 'user' || 'command'
	authNeeded: "", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
