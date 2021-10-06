const { client } = reqlib("/main");

module.exports.fetchChannel = async (id) => {
	const channel = await client.channels.fetch(id);
	return channel;
};
