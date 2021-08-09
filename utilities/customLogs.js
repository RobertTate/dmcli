const chalk = require('chalk');

function prettyLog(text) {
  console.log(`\n\n${chalk.greenBright(text)}\n\n`);
}

function prettyStyle(text) {
  return chalk.greenBright(text)
}

function warningLog(text) {
  console.log(`\n\n${chalk.redBright(text)}\n\n`);
}

function warningStyle(text) {
  return chalk.redBright(text);
}

function actionLog(text) {
  console.log(`\n\n${chalk.cyanBright.bold(text)}\n\n`);
}

function actionStyle(text) {
  return chalk.cyanBright.bold(text);
}

function blueLog(text) {
  console.log(`\n\n${chalk.cyanBright.bold(text)}\n\n`);
}

function blueStyle(text) {
  return chalk.cyanBright.bold(text);
}

module.exports = { 
  prettyLog,
  prettyStyle,
  warningLog,
  warningStyle,
  actionLog,
  actionStyle,
  blueLog,
  blueStyle
};
