const { logs } = reqlib("/utils/settingsManager/get")();
const fs = require("fs");
// Import a package to read the last lines of log file
const readLastLines = require("read-last-lines");

// Logs init
path = `./${logs.logsFile}`;
if (!fs.existsSync(path)) fs.writeFileSync(path, "");

// Init func (clear)
module.exports.clear = () => {
	fs.writeFileSync(path, "");
};

// Log func
module.exports.log = (...args) => {
	let date = new Date().toLocaleTimeString("fr-FR");
	let txt = [];
	args.forEach((arg) => {
		if (typeof arg == "boolean") txt.push(arg ? "true" : "false");
		else if (typeof arg == "object" || typeof arg == "array") txt.push(JSON.stringify(arg));
		else txt.push(arg.toString());
	});
	txt = txt.join(", ");

	console.log(txt);

	txt = `${date} -> ${txt}\n`;
	fs.appendFileSync(path, txt);
};

// To get the text
module.exports.getLogs = async (nbLines) => {
	return await readLastLines.read(path, nbLines);
};
