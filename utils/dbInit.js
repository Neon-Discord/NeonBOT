const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const { log } = reqlib("/utils/log");

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
const db = new JsonDB(new Config(".bot-cache", true, true, "/"));

const initTree = ["giveaways", "mutedMbrs", "giveawaysban", "infochannels", "reactroles"];

initTree.forEach((tree) => {
	if (!db.getData("/")[tree]) {
		db.push(`/${tree}`, []);
		log(`${tree} database path initialized !`);
	}
});

module.exports.db = db;
