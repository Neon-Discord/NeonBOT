const { successMessage } = require("../../utils/infoMessages");

module.exports.run = async (client, message, args) => {
	let amount = args[0] <= 100 && args[0] >= 1 ? args[0] : 100;
	message.channel
		.bulkDelete(amount, true)
		.then((messages) => successMessage(`\`${messages.size}\` messages ont été supprimés !`, message.channel))
		.catch(console.error);
};

module.exports.help = {
	name: "clear",
	aliases: [],
	description: "Just a test",
	usage: "<command> [number of messages]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "2", // sec
	cooldownType: "user", // 'user' || 'command'
	authNeeded: "MANAGE_MESSAGES", // eg. KICK_MEMBERS
	delete: true,
	mention: false,
	args: false,
};
