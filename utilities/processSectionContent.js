const chalk = require('chalk');
const inquirer = require('inquirer');
const { processOption } = require('./processOption');
const InitiativeTracker = require('./initiativeTracker');

async function processSectionContent(content, headingText) {
  const { data } = content
  const backButton = chalk.red.bold('Go Back');
  const initiativeButton = chalk.greenBright.bold('Roll Initiative!');
  let keepGoing = true;

  while (keepGoing) {
    const { option } = await inquirer.prompt({
      type: 'list',
      name: 'option',
      message: `Select an ${chalk.yellowBright.bold('Option')} from ${chalk.green.bold(headingText)}:`,
      choices: [...Object.keys(data), initiativeButton, backButton]
    });

    console.clear();

    if (option === backButton) {
      keepGoing = false;
    } else if (option === initiativeButton) {
      const it = new InitiativeTracker();
      await it.start();
    } else {
      await processOption(data[option], option);
    }
  }
}

module.exports = { processSectionContent }
