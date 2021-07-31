const inquirer = require('inquirer');
const open = require('open');
const chalk = require('chalk');

const { prettyLog } = require('./prettyLog');

async function processOption(optionObj, optionType) {
  const processByType = {
    "Links": async (links) => {
      console.log(chalk.cyanBright.bold('Opening Links...'));
      if (links.length > 0) {
        links.forEach( async (link) => {
          await open(link);        
        });
      } else {
        console.log(chalk.redBright.bold('No Links to Open.'))
      }
    },
    "Text": (text) => {
      prettyLog(text);
    },
    "Topics": async (topics) => {
      const backButton = chalk.red.bold('Go Back');
      let keepGoing = true;
      while (keepGoing) {
        const { topic } = await inquirer.prompt({
          type: 'list',
          name: 'topic',
          message: `Select a ${chalk.yellowBright.bold('Topic')}:`,
          choices: [...Object.keys(topics), backButton]
        });

        console.clear();

        if (topic === backButton) {
          keepGoing = false;
        } else {
          prettyLog(topics[topic]);
        };
      };
    }
  };
  await processByType[optionType](optionObj);
}

module.exports = { processOption }
