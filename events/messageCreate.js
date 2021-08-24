const settings = require("../config/settings.json");
const { Permissions } = require("discord.js");
const { log } = require("../utils/log");
const { errorMessage } = require("../utils/infoMessages");

module.exports = {
	name: "messageCreate",
	once: false,
	execute(client, message) {
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
					commandfile.help.cooldown -
					new Date(Date.now() - commandfile.help.cmd_cooldown_start_date).getSeconds()
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
	},
};