const inquirer = require('inquirer');
const open = require('open');
const chalk = require('chalk');
const prettyoutput = require('prettyoutput');

const { prettyLog, warningLog, actionStyle } = require('../styles/chalkFunctions');

async function processOption(optionObj, optionType) {
  const processByType = {
    "Links": async (links) => {
      if (links.length > 0) {
        console.log(actionStyle('Opening:'));
        console.log(prettyoutput(links));
        links.forEach( async (link) => {
          await open(link);        
        });
      } else {
        warningLog('No Links to Open.');
      };
    },
    "Text": (text) => {
      if (text) {
        prettyLog(text);
      } else {
        warningLog('Text is Empty.')
      }
    },
    "Topics": async (topics) => {
      const backButton = chalk.red.bold('Go Back');
      let keepGoing = true;

      if (Object.keys(topics).length === 0) {
        warningLog('No Topics Have Been Added.');
        keepGoing = false;
      }

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
