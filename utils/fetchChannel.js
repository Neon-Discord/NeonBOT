const { client } = require("../main");

module.exports.fetchChannel = async (id) => {
	const channel = await client.channels.cache.find((ch) => ch.id == id).fetch();
	return channel;
};
