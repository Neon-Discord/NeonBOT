const settings = require("../config/settings.json");
const fs = require("fs");
// Import a package to read the last lines of log file
const readLastLines = require("read-last-lines");

// Logs init
path = `./${settings.logs.cmdHistory}`;
if (!fs.existsSync(path)) fs.writeFileSync(path, "");

// Init func (clear)
module.exports.clear = () => {
	fs.writeFileSync(path, "");
};

// Log func
module.exports.cmdLog = (message) => {
	let date = new Date().toLocaleTimeString("fr-FR");

	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	let txt = `${message.author} used ${command} with args ${JSON.stringify(args)}`;

	txt = `${date} -> ${txt}\n`;
	fs.appendFileSync(path, txt);
};

// To get the text
module.exports.getLogs = async (nbLines) => {
	return await readLastLines.read(path, nbLines);
};
