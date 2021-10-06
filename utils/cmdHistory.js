const { logs } = reqlib("/utils/settingsManager/get")();
const fs = require("fs");
// Import a package to read the last lines of log file
const readLastLines = require("read-last-lines");

// Logs init
cmdHistoryPath = `./${logs.cmdHistory}`;
if (!fs.existsSync(cmdHistoryPath)) fs.writeFileSync(cmdHistoryPath, "");

// Init func (clear)
module.exports.clearHistory = () => {
  fs.writeFileSync(cmdHistoryPath, "");
};

// Log func
module.exports.cmdLog = (author, command, args) => {
  let time = new Date().toLocaleTimeString("fr-FR");
  let line = `${author} used ${command} : ${JSON.stringify(args)}`;

  line = `${time} -> ${line}\n`;
  fs.appendFileSync(cmdHistoryPath, line);
};

// To get the text
module.exports.getCmdHistory = async (nbLines) => {
  return await readLastLines.read(cmdHistoryPath, nbLines);
};
