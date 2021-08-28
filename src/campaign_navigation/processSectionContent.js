const fs = require('fs');
const { join } = require('path');

const chalk = require('chalk');
const inquirer = require('inquirer');
const { processOption } = require('./processOption');
const { editContentItem } = require('./editContentItem');
const InitiativeTracker = require('../initiative_tracking/initiativeTracker');
const search5eContent = require('../fifth_edition_api/search5eContent');


async function processSectionContent(headingText, datapath) {
  const editContentButton = chalk.magentaBright.bold('Edit Content');
  const initiativeButton = chalk.greenBright.bold('Roll Initiative');
  const search5eContentButton = chalk.blueBright.bold('Search 5e Content');
  const backButton = chalk.red.bold('Go Back');

  let keepGoing = true;

  while (keepGoing) {
    let content = JSON.parse(fs.readFileSync(join(__basedir, datapath), 'utf8', 'r'));
    const { data } = content

    const { option } = await inquirer.prompt({
      type: 'list',
      name: 'option',
      message: `Select an ${chalk.yellowBright.bold('Option')} from ${chalk.green.bold(headingText)}:`,
      choices: [
        ...Object.keys(data),
        editContentButton, 
        initiativeButton,
        search5eContentButton,
        backButton
      ]
    });

    console.clear();

    if (option === backButton) {
      keepGoing = false;
    } else if (option === editContentButton) {
      await editContentItem(datapath);
    } else if (option === initiativeButton) {
      const it = new InitiativeTracker();
      await it.start();
    } else if (option === search5eContentButton) {
      await search5eContent();
    } else {
      await processOption(data[option], option);
    }
  }
}

module.exports = { processSectionContent }
