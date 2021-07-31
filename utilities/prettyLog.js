const chalk = require('chalk');

function prettyLog(text) {
  console.log(`\n\n${chalk.greenBright(text)}\n\n`);
}

module.exports = { prettyLog };
