const { logs } = require("../config/settings.json");
const fs = require("fs");

const readLastLines = require("read-last-lines");

path = `./${logs.logsFile}`;
if (!fs.existsSync(path)) fs.writeFileSync(path, "");

module.exports.init = () => {
	fs.writeFileSync(path, "");
};

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
module.exports.getLogs = async (nbLines) => {
	return await readLastLines.read(path, nbLines);
};
