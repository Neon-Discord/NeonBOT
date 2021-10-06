// To change config without reload bot
const {readFileSync} = require('fs')
module.exports = () => {
    return JSON.parse(readFileSync('./config/settings.json'));
}