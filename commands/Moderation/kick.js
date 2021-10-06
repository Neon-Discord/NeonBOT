const { errorMessage, successMessage } = reqlib("/utils/infoMessages");

module.exports.run = async (client, message, args) => {
	let member = message.mentions.members.first();

	if (!member.kickable) return errorMessage(`Je ne peux pas kicker ${message.mentions.users.first()} !`, message.channel);

	const reason = args.length > 1 ? args.splice(1).join(" ") : "";

	member.kick(reason).then(successMessage(`${message.mentions.users.first()} à bien été kické !`, message.channel));
};

module.exports.help = {
	name: "kick",
	aliases: [],
	description: "Kick the member",
	usage: "<command> @member [reason]", // '[]' for not necessary args and '||' for OR symbol
	cooldown: "10", // sec
	cooldownType: "command", // 'user' || 'command'
	delete: true,
	mention: true,
	args: false,
};
