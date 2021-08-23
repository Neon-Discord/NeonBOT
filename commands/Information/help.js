const { MessageEmbed } = require("discord.js");
const config = require("../../config/settings.json");

module.exports.run = async (client, message, args) => {
	if (args.length <= 0) listCategs(client, message);
	else if (client.commandsTree.findIndex((categ) => categ.name == args[0].toLowerCase()) > -1)
		listCommandsInCateg(
			client.commandsTree.findIndex((categ) => categ.name == args[0].toLowerCase()),
			client,
			message
		);
	else if (client.commands.get(args[0].toLowerCase()))
		showCommandHelp(client.commands.get(args[0].toLowerCase()).help, client, message);
};

const listCategs = (client, message) => {
	let fields = [];
	client.commandsTree.forEach((category) => {
		fields.push({
			name: capitalize(category.name),
			value: `\`${config.prefix}help ${category.name}\``,
			inline: true,
		});
	});
	const exampleEmbed = new MessageEmbed()
		.setColor(config.help.embedColor)
		.setAuthor("Neon BOT commands", client.user.displayAvatarURL())
		.setThumbnail(client.user.displayAvatarURL())
		.addFields(fields);

	message.channel.send({ embeds: [exampleEmbed] });
};

const listCommandsInCateg = (index, client, message) => {
	let fields = [];
	client.commandsTree[index].commands.forEach((cmd) => {
		fields.push({
			name: `\`${config.prefix + cmd.usage}\``,
			value: cmd.description,
			inline: false,
		});
	});
	const exampleEmbed = new MessageEmbed()
		.setColor(config.help.embedColor)
		.setAuthor(`Commands in ${client.commandsTree[index].name}`, client.user.displayAvatarURL())
		.setDescription(`${config.prefix}help <command> for more info`)
		.setThumbnail(client.user.displayAvatarURL())
		.addFields(fields);

	message.channel.send({ embeds: [exampleEmbed] });
};

const showCommandHelp = (cmd, client, message) => {
	const exampleEmbed = new MessageEmbed()
		.setColor(config.help.embedColor)
		.setAuthor(`Help for ${config.prefix}${cmd.name}`, client.user.displayAvatarURL())
		.setThumbnail(client.user.displayAvatarURL())
		.addFields([
			{
				name: "Usage :",
				value: config.prefix + cmd.usage,
			},
			{
				name: "Description :",
				value: cmd.description,
			},
			{
				name: "Aliases :",
				value: `\`${config.prefix + cmd.aliases.join(", " + config.prefix)}\``,
			},
			{
				name: `Cooldown: ${cmd.cooldown > 0 ? cmd.cooldown + "sec" : "No Cooldown"}`,
				value: `Cooldown type: ${cmd.cooldown > 0 ? cmd.cooldownType : "No Cooldown"}`,
			},
			{
				name: "Permission needed",
				value: `${cmd.authNeeded != "" ? cmd.authNeeded : "No permission required"}`,
			},
		]);

	message.channel.send({ embeds: [exampleEmbed] });
};

function capitalize(word) {
	return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

module.exports.help = {
	name: "help",
	aliases: ["h", "?"],
	description: "Show commands",
	usage: "help [command || category]",
	cooldown: "10", // sec
	cooldownType: "user", // 'user' || 'command'
	authNeeded: "", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
