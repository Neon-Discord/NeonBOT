// Config
const config = require("./config/config.json");
const settings = require("./config/settings.json");

// Require
const { Client, Collection, Permissions, MessageEmbed } = require("discord.js");
const fs = require("fs");

// Utils
const errorEmbed = require("./utils/errorEmbed");

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
const innerBoxLen = 62;
console.log(` ${"_".repeat(innerBoxLen)} `);
console.log(`| Commands loaded :${" ".repeat(innerBoxLen - (1 + "Commands loaded :".length))}|`);
const categories = fs.readdirSync("./commands/");
categories.forEach((categ) => {
	const files = fs.readdirSync(`./commands/${categ}/`);

	let jsfiles = files.filter((f) => f.split(".").pop() === "js"); // Find all the js files in the folder ...
	if (jsfiles.length <= 0) return;

	console.log(`|    ${categ}${" ".repeat(innerBoxLen - (categ.length + 4))}|`);

	let categoryCommands = [];
	// And store them in the collection
	jsfiles.forEach((f) => {
		let commandLoaded = require(`./commands/${categ}/${f}`); // Load the command script
		client.commands.set(commandLoaded.help.name, commandLoaded); // And save the command in the collection
		categoryCommands.push(commandLoaded.help);
		// Log to the console
		console.log(`|     - ${f}${" ".repeat(innerBoxLen - (f.length + 7))}|`);
	});
	client.commandsTree.push({
		name: categ.toLowerCase(),
		commands: categoryCommands,
	});
});
console.log(`|${"_".repeat(innerBoxLen)}|`);
//Playing Message
client.on("ready", async () => {
	client.readyDate = Date.now();
	console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);

	client.user.setActivity(`${settings.prefix}help`, { type: "PLAYING" });
});

//Add Role And Welcome New Member
client.on("guildMemberAdd", (member) => {
	console.log("User" + member.user.tag + "has joined the server!");

	var role = member.guild.roles.find((role) => role.id == settings.welcome.welcomeRole);

	client.channels.find((ch) => ch.name == config.welcome.welcomeChannel).send("Welcome " + member.username);

	setTimeout(function () {
		member.addRole(role);
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

	console.log(command, args);

	// Verify if the command exists
	let commandfile = client.commands.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command));
	if (!commandfile) return;

	// Delete the command message if needed
	if (commandfile.help.delete)
		setTimeout(() => {
			message.delete();
		}, settings.commandMessageDeleteAfter || 0);

	// Check permissions
	const permNeeded = commandfile.help.authNeeded;
	if (permNeeded != "" && !message.member.permissions.has(Permissions.FLAGS[permNeeded]))
		return errorEmbed(`Vous devez avoir la permission ${permNeeded} pour effectuer cette action !`, message);

	// Checks if the commands needs args
	if (commandfile.help.args && args.length < 1)
		return errorEmbed(
			`Cette commande necessite des arguments: \`${settings.prefix + commandfile.help.usage}\``,
			message
		);

	// Checks if the command needs mention
	if (commandfile.help.mention && !message.mentions.users.first())
		return errorEmbed(
			`Cette commande necessite une mension: \`${settings.prefix + commandfile.help.usage}\``,
			message
		);

	// Check if the command has a cooldown pending
	if (commandfile.help.locked === true)
		return errorEmbed(
			`Cette commande est soumise à un cooldown de ${commandfile.help.cooldown} secondes, merci d'attendre ${
				commandfile.help.cooldown - new Date(Date.now() - commandfile.help.cmd_cooldown_start_date).getSeconds()
			} secondes avant de pouvoir l'utiliser à nouveau`,
			message
		);
	else if (
		commandfile.help.locked_users &&
		commandfile.help.locked_users.findIndex((cld) => cld.id == message.author.id) > -1
	)
		return errorEmbed(
			`Cette commande est soumise à un cooldown de ${
				commandfile.help.cooldown
			} secondes par utilisateur, merci d'attendre ${
				commandfile.help.cooldown -
				new Date(
					Date.now() - commandfile.help.locked_users.find((cld) => cld.id == message.author.id).start_time
				).getSeconds()
			} secondes avant de pouvoir l'utiliser à nouveau`,
			message
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
