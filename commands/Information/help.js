const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config/settings.json");
const { errorMessage } = require("../../utils/infoMessages");

const msgCloseButton = new MessageActionRow().addComponents(new MessageButton().setCustomId("close").setLabel("J'ai compris !").setStyle("PRIMARY"));

module.exports.run = async (client, message, args) => {
	if (args.length <= 0) listCategs(client, message);
	else if (client.commandsTree.findIndex((categ) => categ.cmd == args[0].toLowerCase()) > -1)
		listCommandsInCateg(
			client.commandsTree.findIndex((categ) => categ.cmd == args[0].toLowerCase()),
			client,
			message
		);
	else if (client.commands.find((cmd) => cmd.help.name == args[0] || cmd.help.aliases.includes(args[0])))
		showCommandHelp(client.commands.find((cmd) => cmd.help.name == args[0] || cmd.help.aliases.includes(args[0])).help, client, message);
};

const authorizedCateg = (ctgName, mbr, client) => {
	const category = client.commandsTree.find((ctg) => ctg.name === ctgName);
	if (category.authorisation !== "" && !mbr.permissions.has(Permissions.FLAGS[category.authorisation])) return false;
	return true;
};

const listCategs = (client, message) => {
	let fields = [];
	client.commandsTree.forEach((category) => {
		if (category.authorisation !== "" && !message.member.permissions.has(Permissions.FLAGS[category.authorisation])) return;
		fields.push({
			name: category.name,
			value: `\`${config.prefix}help ${category.cmd}\``,
			inline: true,
		});
	});
	const exampleEmbed = new MessageEmbed()
		.setColor(config.help.embedColor)
		.setAuthor("Neon BOT commands", client.user.displayAvatarURL())
		.setThumbnail(client.user.displayAvatarURL())
		.addFields(fields);
	message.channel.send({ embeds: [exampleEmbed], components: [msgCloseButton] });
};

const listCommandsInCateg = (index, client, message) => {
	if (!authorizedCateg(client.commandsTree[index].name, message.member, client))
		return errorMessage("Vous n'avez pas la permission d'utiliser les commandes dans cette catégorie", message.channel);
	let fields = [];
	client.commandsTree[index].commands.forEach((cmd) => {
		fields.push({
			name: `\`${config.prefix + cmd.usage.replace("<command>", cmd.name)}\``,
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

	message.channel.send({ embeds: [exampleEmbed], components: [msgCloseButton] });
};

const showCommandHelp = (cmd, client, message) => {
	if (!authorizedCateg(client.commandsTree.find((ctg) => ctg.name === cmd.categ).name, message.member, client))
		return errorMessage("Vous n'avez pas la permission d'utiliser cette commande", message.channel);
	const exampleEmbed = new MessageEmbed()
		.setColor(config.help.embedColor)
		.setAuthor(`Help for ${config.prefix}${cmd.name}`, client.user.displayAvatarURL())
		.setThumbnail(client.user.displayAvatarURL())
		.addFields([
			{
				name: "Usage :",
				value: `\`${config.prefix + cmd.usage.replace("<command>", cmd.name)}\``,
			},
			{
				name: "Description :",
				value: cmd.description,
			},
			{
				name: "Aliases :",
				value: `\`${cmd.aliases.length ? config.prefix + cmd.aliases.join(", " + config.prefix) : "No aliases"}\``,
			},
			{
				name: `Cooldown: ${cmd.cooldown > 0 ? cmd.cooldown + "sec" : "No Cooldown"}`,
				value: `Cooldown type: ${cmd.cooldown > 0 ? cmd.cooldownType : "No Cooldown"}`,
			},
		]);

	message.channel.send({ embeds: [exampleEmbed], components: [msgCloseButton] });
};

module.exports.help = {
	name: "help",
	aliases: ["h", "?"],
	description: "Show commands",
	usage: "<command> [command || category]",
	cooldown: "2", // sec
	cooldownType: "user", // 'user' || 'command'
	authNeeded: "", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
