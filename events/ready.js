const settings = require("../config/settings.json");
const { log } = require("../utils/log");
const { db } = require("../utils/dbInit");
const { fetchChannel } = require("../utils/fetchChannel");

module.exports = {
	name: "ready",
	once: true,
	execute: async (Otherclient, client) => {
		client.readyDate = Date.now(); // Set the readyDate for the uptime command
		log(`${client.user.username} is online !`);

		// Fetch giveaway messages to recieve the MessageReactionAdd event
		const channel = await fetchChannel(settings.giveaways.channelId);
		const giveaways = db.getData("/giveaways");
		giveaways.forEach((giv) => {
			channel.messages.fetch(giv.id).then(console.log());
		});

		client.user.setActivity(`${settings.prefix}help`, { type: "PLAYING" });
	},
};
