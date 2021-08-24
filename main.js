// Config
const config = require("./config/config.json");
const settings = require("./config/settings.json");

// Require
const { Client, Collection, Permissions, MessageEmbed } = require("discord.js");
const fs = require("fs");

// Utils
const { errorMessage, infoMessage } = require("./utils/infoMessages");
const { log, clear } = require("./utils/log");
clear();
const Infobox = require("./utils/infobox");

// Init the client
const client = new Client({
	disableEveryone: true,
	intents:
		"GUILDS GUILD_MEMBERS GUILD_BANS GUILD_EMOJIS_AND_STICKERS GUILD_INTEGRATIONS GUILD_WEBHOOKS GUILD_INVITES GUILD_VOICE_STATES GUILD_PRESENCES GUILD_MESSAGES GUILD_MESSAGE_REACTIONS GUILD_MESSAGE_TYPING DIRECT_MESSAGES DIRECT_MESSAGE_REACTIONS DIRECT_MESSAGE_TYPING".split(
			" "
		),
});

// Create the commands Discord collection
client.commands = new Collection();
client.commandsTree = [];

// Read the commands folder and store all the commands found in the collection
const categories = fs.readdirSync("./commands/");

// Init the infobox
const infobox = new Infobox({
	width: 30,
	padding: 1,
	paddingHeight: 0,
});
infobox.begin().add("Commands loaded :");

// For each categories
categories.forEach((categ) => {
	// Read the files in the category
	const files = fs.readdirSync(`./commands/${categ}/`);
	// Find all the js files in the folder ...
	let jsfiles = files.filter((f) => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) return;

	// Add the category to the infobox
	infobox.add(`  ${categ}`);

	// For each commands in the category
	let categoryCommands = [];
	jsfiles.forEach((file) => {
		// Load the command script
		let commandLoaded = require(`./commands/${categ}/${file}`);
		// And save the command in the collection
		client.commands.set(commandLoaded.help.name, commandLoaded);
		categoryCommands.push(commandLoaded.help);
		// Log to the console
		infobox.add(`  - ${file}`);
	});

	// Store the command in the commandsTree variable for the help command
	client.commandsTree.push({
		name: categ.toLowerCase(),
		commands: categoryCommands,
	});
});
infobox.finish(); // Close the infobox

// Playing Message
client.on("ready", async () => {
	client.readyDate = Date.now(); // Set the readyDate for the uptime command
	log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);

	client.user.setActivity(`${settings.prefix}help`, { type: "PLAYING" });
});

// Add Role And Welcome New Member
client.on("guildMemberAdd", (member) => {
	log("User" + member.user.tag + " has joined the server!");

	var role = member.guild.roles.cache.find((role) => role.id == settings.welcome.welcomeRole);

	infoMessage(
		`${member} A rejoint le serveur !`,
		member.guild.channels.cache.find((ch) => ch.id == settings.welcome.welcomeChannel)
	);

	setTimeout(function () {
		member.roles.add(role);
	}, 10000);
});

//Command Manager
client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	if (!message.content.startsWith(settings.prefix)) return; // If the message is a command
	let command = message.content.substring(settings.prefix.length).split(" ");
	const args = command.splice(1);
	command = command[0];

	log(command, args);

	// Verify if the command exists
	let commandfile = client.commands.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command));
	if (!commandfile) return;

	// // Delete the command message if needed
	// if (commandfile.help.delete) {
	// 	var testmsg = message;
	// 	setTimeout(() => {
	// 		testmsg.delete();
	// 	}, settings.commandMessageDeleteAfter || 0);
	// }

	// Check permissions
	const permNeeded = commandfile.help.authNeeded;
	if (permNeeded != "" && !message.member.permissions.has(Permissions.FLAGS[permNeeded]))
		return errorMessage(`Vous devez avoir la permission ${permNeeded} pour effectuer cette action !`, message);

	// Checks if the commands needs args
	if (commandfile.help.args && args.length < 1)
		return errorMessage(
			`Cette commande necessite des arguments: \`${settings.prefix + commandfile.help.usage}\``,
			message.channel
		);

	// Checks if the command needs mention
	if (commandfile.help.mention && !message.mentions.users.first())
		return errorMessage(
			`Cette commande necessite une mention: \`${settings.prefix + commandfile.help.usage}\``,
			message.channel
		);

	// Check if the command has a cooldown pending
	if (commandfile.help.locked === true)
		return errorMessage(
			`Cette commande est soumise à un cooldown de ${commandfile.help.cooldown} secondes, merci d'attendre ${
				commandfile.help.cooldown - new Date(Date.now() - commandfile.help.cmd_cooldown_start_date).getSeconds()
			} secondes avant de pouvoir l'utiliser à nouveau`,
			message.channel
		);
	else if (
		commandfile.help.locked_users &&
		commandfile.help.locked_users.findIndex((cld) => cld.id == message.author.id) > -1
	)
		return errorMessage(
			`Cette commande est soumise à un cooldown de ${
				commandfile.help.cooldown
			} secondes par utilisateur, merci d'attendre ${
				commandfile.help.cooldown -
				new Date(
					Date.now() - commandfile.help.locked_users.find((cld) => cld.id == message.author.id).start_time
				).getSeconds()
			} secondes avant de pouvoir l'utiliser à nouveau`,
			message.channel
		);

	// Execute the command
	commandfile.run(client, message, args);

	// Cooldown
	if (!commandfile.help.cooldown > 0) return;
	if (commandfile.help.cooldownType == "command") {
		let currentDate = Date.now();

		client.commands.find(
			(cmd) => cmd.help.name == command || cmd.help.aliases.includes(command)
		).help.locked = true;
		client.commands.find(
			(cmd) => cmd.help.name == command || cmd.help.aliases.includes(command)
		).help.cmd_cooldown_start_date = currentDate;
		setInterval(() => {
			client.commands.find(
				(cmd) => cmd.help.name == command || cmd.help.aliases.includes(command)
			).help.locked = false;
		}, commandfile.help.cooldown * 1000);
	} else if (commandfile.help.cooldownType == "user") {
		if (
			!client.commands.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command)).help
				.locked_users
		) {
			client.commands.find(
				(cmd) => cmd.help.name == command || cmd.help.aliases.includes(command)
			).help.locked_users = [];
		}
		client.commands
			.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command))
			.help.locked_users.push({
				id: message.author.id,
				start_time: Date.now(),
			});
		setTimeout(() => {
			client.commands
				.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command))
				.help.locked_users.splice(
					client.commands
						.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command))
						.help.locked_users.findIndex((cld) => cld.id == message.author.id),
					1
				);
		}, commandfile.help.cooldown * 1000);
	}
});

//Token need in token.json
client.login(config.token);
