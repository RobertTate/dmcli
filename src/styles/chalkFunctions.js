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
  console.log(`\n\n${chalk.blueBright.bold(text)}\n\n`);
}

function blueStyle(text) {
  return chalk.blueBright.bold(text);
}

function orangeLog(text) {
  console.log(`\n\n${chalk.hex('#ff9c08').bold(text)}\n\n`);
}

function orangeStyle(text) {
  return chalk.hex('#ff9c08').bold(text);
}

function magentaLog(text) {
  console.log(`\n\n${chalk.magentaBright.bold(text)}\n\n`);
}

function magentaStyle(text) {
  return chalk.magentaBright.bold(text);
}

function magentaLog(text) {
  console.log(`\n\n${chalk.magentaBright.bold(text)}\n\n`);
}

function magentaStyle(text) {
  return chalk.magentaBright.bold(text);
}

function yellowLog(text) {
  console.log(`\n\n${chalk.yellow.bold(text)}\n\n`);
}

function yellowStyle(text) {
  return chalk.yellow.bold(text);
}

module.exports = { 
  prettyLog,
  prettyStyle,
  warningLog,
  warningStyle,
  actionLog,
  actionStyle,
  blueLog,
  blueStyle,
  orangeLog,
  orangeStyle,
  magentaLog,
  magentaStyle,
  yellowLog,
  yellowStyle
};
