const settings = require("../config/settings.json");
const { Permissions } = require("discord.js");
const { cmdLog } = require("../utils/cmdHistory");
const { errorMessage } = require("../utils/infoMessages");

module.exports = {
	name: "messageCreate",
	once: false,
	execute: async (client, message) => {
		// Verify if the message is from normal account in the target server
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (!message.guild.id === settings.guildId) return;

		// Checks if the message is not in the responding_value array
		if (client.responding_list.has(`${message.channel.id}||${message.author.id}`)) {
			const after_run_config = await client.responding_list
				.get(`${message.channel.id}||${message.author.id}`)
				.responding(client, message, message.content);

			if (!after_run_config || !after_run_config.wait_for_response)
				return client.responding_list.delete(`${message.channel.id}||${message.author.id}`);
		}

		// Checks if the message is a command
		if (!message.content.startsWith(settings.prefix)) return;

		// Split command and args
		const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		// Verify if the command exists
		let commandfile = client.commands.find((cmd) => cmd.help.name == command || cmd.help.aliases.includes(command));
		if (!commandfile) return;

		// Logs the command the the cmdHistory log file
		cmdLog(message.author.tag, command, args);

		// Delete the command message if needed
		if (commandfile.help.delete) {
			var msgcopy = message;
			setTimeout(() => {
				if (!msgcopy.deleted) msgcopy.delete();
			}, settings.commandMessageDeleteAfter || 0);
		}

		// Check permissions
		const permNeeded = commandfile.help.authNeeded;
		if (permNeeded != "" && !message.member.permissions.has(Permissions.FLAGS[permNeeded]))
			return errorMessage(`Vous devez avoir la permission ${permNeeded} pour effectuer cette action !`, message);

		// Checks if the commands needs args
		if (commandfile.help.args && args.length < 1)
			return errorMessage(
				`Cette commande necessite des arguments: \`${
					settings.prefix + commandfile.help.usage.replace("<command>", command)
				}\``,
				message.channel
			);

		// Checks if the command needs mention
		if (commandfile.help.mention && !(message.mentions.users.first() || message.mentions.channels.first()))
			return errorMessage(
				`Cette commande necessite une mention: \`${
					settings.prefix + commandfile.help.usage.replace("<command>", command)
				}\``,
				message.channel
			);

		// Check if the command has a cooldown pending
		if (commandfile.help.locked === true) {
			return errorMessage(
				`Cette commande est soumise à un cooldown de ${commandfile.help.cooldown} secondes, merci d'attendre ${
					commandfile.help.cooldown -
					new Date(Date.now() - commandfile.help.cmd_cooldown_start_date).getSeconds()
				} secondes avant de pouvoir l'utiliser à nouveau`,
				message.channel
			);
		} else if (
			commandfile.help.locked_users &&
			commandfile.help.locked_users.findIndex((cld) => cld.id == message.author.id) > -1
		) {
			// If the user has a cooldown pending
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
		}

		// Execute the command
		const after_run_config = await commandfile.run(client, message, args);

		// If the command need a response
		if (after_run_config && after_run_config.wait_for_response) {
			if (client.responding_list.has(`${message.channel.id}||${message.author.id}`)) return;
			client.responding_list.set(`${message.channel.id}||${message.author.id}`, commandfile);
		}

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
