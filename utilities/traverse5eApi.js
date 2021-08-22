const fetch = require('node-fetch');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const chalk = require('chalk');
const prettyoutput = require('prettyoutput')

const { warningLog, prettyStyle, blueStyle } = require('./customLogs');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

async function traverse5eApi(urlSegment) {
  try {
    let request = await fetch(`https://www.dnd5eapi.co/api/${urlSegment}`);
    let response = await request.json();

    if (response.results && response.results.length > 0) {
      const goBackButton = chalk.red.bold('Go Back');
      const resultNames = await response.results.map((result) => {
        return result.name;
      });

      let { selection } = await inquirer.prompt({
        type: 'autocomplete',
        name: 'selection',
        message: "Start typing to find what you're looking for.",
        source:  async (answers, input) => {
          const fuzzyResult = await fuzzy.filter(input || "", resultNames);          
          let fuzzyResultNames = [];
          for (let result of fuzzyResult) {
            fuzzyResultNames.push(result.original);
          }
          return [...fuzzyResultNames, goBackButton];
        }
      });

      if (selection !== goBackButton) {
        let nextUrlSegment = returnResultUrl(selection, response);
        await traverse5eApi(`${urlSegment}/${nextUrlSegment}`);
      }
    } else {
      console.clear();
      await displayItem(response);
      let nextUrlSegment = urlSegment.substr(0, urlSegment.lastIndexOf("\/"));
      await traverse5eApi(nextUrlSegment);
    }
  } catch (error) {
    warningLog(error);
  }
}

function returnResultUrl(selection, response) {
  return response.results.find((result) => {
    return result.name === selection;
  }).index;
}

async function displayItem(response) {
  const goBackButton = chalk.red.bold('Go Back');
  let keepGoing = true;

  while (keepGoing) {
    let { itemProp } = await inquirer.prompt({
      type: 'list',
      name: 'itemProp',
      message: "View this selection's properties:",
      choices: [
        ...Object.keys(response),
        goBackButton
      ]
    });

    if (itemProp === goBackButton) {
      keepGoing = false;
    } else {
      console.clear();
      if (response[itemProp] === Object(response[itemProp])) {
        console.log(prettyStyle('----------------------------------------------------\n'));
        console.log(prettyoutput(response[itemProp], {maxDepth: 10}));
        console.log('\n');
      } else {
        console.log(prettyStyle('----------------------------------------------------\n'));
        console.log(prettyStyle(response[itemProp]));
        console.log('\n');
      }
    }
  }
};

module.exports = { traverse5eApi }
