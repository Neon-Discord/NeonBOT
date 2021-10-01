const { client } = require("../main");

module.exports.fetchChannel = async (id) => {
	const channel = await client.channels.fetch(id);
	return channel;
};
