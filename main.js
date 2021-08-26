// Config
const config = require("./config/config.json");

// Require
const { Client, Collection } = require("discord.js");
const fs = require("fs");

// Utils
const { clear } = require("./utils/log");
clear();
const { clearHistory } = require("./utils/cmdHistory");
clearHistory();
const Infobox = require("./utils/infobox");

// Init the client
const client = new Client({
	disableEveryone: true,
	intents:
		"GUILDS GUILD_MEMBERS GUILD_BANS GUILD_EMOJIS_AND_STICKERS GUILD_INTEGRATIONS GUILD_WEBHOOKS GUILD_INVITES GUILD_VOICE_STATES GUILD_PRESENCES GUILD_MESSAGES GUILD_MESSAGE_REACTIONS GUILD_MESSAGE_TYPING DIRECT_MESSAGES DIRECT_MESSAGE_REACTIONS DIRECT_MESSAGE_TYPING".split(
			" "
		),
});

module.exports.client = client;
//
//
//
// SECTION: Events Handler
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

// Init the infobox
const eventsBox = new Infobox({
	width: 30,
	padding: 1,
	paddingHeight: 0,
});
eventsBox.begin().add("Events loaded :");

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	eventsBox.add(`  - ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}
eventsBox.finish();

//
//
//
// SECTION: Commands handler

// Create the commands Discord collection
client.commands = new Collection();
client.commandsTree = [];

// Read the commands folder and store all the commands found in the collection
const categories = fs.readdirSync("./commands/");

// Init the infobox
const cmdBox = new Infobox({
	width: 30,
	padding: 1,
	paddingHeight: 0,
});
cmdBox.begin().add("Commands loaded :");

// For each categories
categories.forEach((categ) => {
	// Read the files in the category
	const jsfiles = fs.readdirSync(`./commands/${categ}/`).filter((file) => file.endsWith(".js"));
	// Find all the js files in the folder ...
	if (jsfiles.length <= 0) return;

	// Add the category to the infobox
	cmdBox.add(`  ${categ}`);

	// For each commands in the category
	let categoryCommands = [];
	jsfiles.forEach((file) => {
		// Load the command script
		let commandLoaded = require(`./commands/${categ}/${file}`);
		// And save the command in the collection
		client.commands.set(commandLoaded.help.name.toLowerCase(), commandLoaded);
		categoryCommands.push(commandLoaded.help);
		// Log to the console
		cmdBox.add(`  - ${file}`);
	});

	// Store the command in the commandsTree variable for the help command
	const config_file = JSON.parse(fs.readFileSync(`./commands/${categ}/.cat-config`));
	client.commandsTree.push({
		name: config_file.name,
		cmd: config_file.help_command,
		authorisation: config_file.authorisation,
		commands: categoryCommands,
	});
});
cmdBox.finish(); // Close the infobox

//Token need in token.json
client.login(config.token);
