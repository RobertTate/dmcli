const chalk = require('chalk');
const inquirer = require('inquirer');
const { processOption } = require('./processOption');

async function processSectionContent(content) {
  const { data } = content
  const backButton = chalk.red.bold('Go Back');
  let keepGoing = true;

  while (keepGoing) {
    const { option } = await inquirer.prompt({
      type: 'list',
      name: 'option',
      message: `Select an ${chalk.yellowBright.bold('Option')} from this ${chalk.green.bold('Section')}:`,
      choices: [...Object.keys(data), backButton]
    });

    console.clear();

    if (option === backButton) {
      keepGoing = false;
    } else {
      await processOption(data[option], option);
    }
  }
}

module.exports = { processSectionContent }
