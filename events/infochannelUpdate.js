const { welcome } = require("../config/settings.json");
const { log } = require("../utils/log");
const { createEventMessage } = require("../utils/eventMessages");
const { db } = require("../utils/dbInit");

module.exports = {
	name: "guildMemberUpdate",
	once: false,
	execute: async (client, oldMember, newMember) => {
		const current_infoch = db.getData("/infochannels");

		if (!current_infoch.length) return;
		current_infoch.forEach(async (ich) => {
			const channel = await oldMember.guild.channels.fetch(ich.ch_id);
			const role = await oldMember.guild.roles.fetch(ich.role_id);
			channel.setName(`ℹ | ${role.name} : ${role.members.size}`);
			log(`${channel.id} Infochannel ${role.name} updated to : ${role.members.size} !`);
		});
	},
};
