const { prefix } = require("../config/settings.json");
const { log } = require("../utils/log");

module.exports = {
	name: "ready",
	once: true,
	execute(Otherclient, client) {
		client.readyDate = Date.now(); // Set the readyDate for the uptime command
		log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);

		client.user.setActivity(`${prefix}help`, { type: "PLAYING" });
	},
};
