const { errorMessage, successMessage } = reqlib("/utils/infoMessages");

module.exports.run = async (client, message, args) => {
	let member = message.mentions.members.first();

	if (!member.bannable) return errorMessage(`Je ne peux pas ban ${message.mentions.users.first()} !`, message.channel);

	const reason = args.length > 1 ? args.splice(1).join(" ") : "";

	member.ban({ reason: reason }).then(successMessage(`${message.mentions.users.first()} à bien été ban du serveur !`, message.channel));
};

module.exports.help = {
	name: "ban",
	aliases: [],
	description: "Ban the member",
	usage: "<command> @member [reason]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: true,
	args: false,
};
