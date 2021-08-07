const chalk = require('chalk');

function prettyLog(text) {
  console.log(`\n\n${chalk.greenBright(text)}\n\n`);
}

function warningLog(text) {
  console.log(`\n\n${chalk.redBright(text)}\n\n`);
}

function actionLog(text) {
  console.log(`\n\n${chalk.cyanBright.bold(text)}\n\n`);
}

module.exports = { prettyLog, warningLog, actionLog };
