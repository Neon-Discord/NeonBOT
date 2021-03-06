const settings = reqlib("/utils/settingsManager/get")();
const { log } = reqlib("/utils/log");
const { db } = reqlib("/utils/dbInit");
const { fetchChannel } = reqlib("/utils/fetchChannel");
const { createEventMessage } = reqlib("/utils/eventMessages");

module.exports = {
	name: "ready",
	once: true,
	execute: async (Otherclient, client) => {
		client.readyDate = Date.now(); // Set the readyDate for the uptime command
		log(`${client.user.username} is online !`);

		// Error handling
		// process.on("unhandledRejection", (error) => {
		// 	log("Unhandled promise rejection:", error);
		// 	createEventMessage({
		// 		color: "#FF2255",
		// 		author: "NeonBOT internal error",
		// 		text: `<@${settings.owner_id}> : ${JSON.stringify(error)}`,
		// 		footer: error.name,
		// 	});
		// });

		// Fetch giveaway messages to recieve the MessageReactionAdd event
		const channel = await fetchChannel(settings.giveaways.channelId);
		const giveaways = db.getData("/giveaways");
		giveaways.forEach((giv) => {
			channel.messages.fetch(giv.id).then(console.log());
		});

		// Fetch reactroles messages to recieve the MessageReactionAdd event
		const rr_channel = await fetchChannel(settings.reactrole.channelId);
		const reactroles = db.getData("/giveaways");
		reactroles.forEach((giv) => {
			rr_channel.messages.fetch(giv.id).then(console.log());
		});

		client.user.setActivity(`${settings.prefix}help`, { type: "PLAYING" });

		reqlib("/exec_start.js").run(client);
	},
};
