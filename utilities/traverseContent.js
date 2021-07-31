const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { processSectionContent } = require('./processSectionContent');

async function traverseContent(filepath) {
  console.clear();

  let currentFilePath = filepath;
  let datapath = `./campaigns/${currentFilePath}/data.json`;
  let headingText = currentFilePath.split('/').pop();

  if (fs.existsSync(datapath)) {
    let content = JSON.parse(fs.readFileSync(datapath, 'utf8', 'r'));
    await processSectionContent(content, headingText);
    currentFilePath = currentFilePath.split("/").slice(0, -1).join('/');
    headingText = currentFilePath.split('/').pop();
  }
  
  let nextFolderOptions = fs.readdirSync(`./campaigns/${currentFilePath}`, 'utf8');  
  const goBackButton = chalk.red.bold('Go Back');

  const { nextFolder } = await inquirer.prompt({
    type: 'list',
    name: 'nextFolder',
    message: `Choose A ${chalk.blue.bold('Folder')} within ${chalk.yellow.bold(headingText)}:`,
    choices: [...nextFolderOptions, goBackButton]
  });

  if (nextFolderOptions.includes(nextFolder)) {
    let nextFilepath = `${currentFilePath}/${nextFolder}`;
    await traverseContent(nextFilepath);
  } else {
    let nextFilepath = currentFilePath.substr(0, currentFilePath.lastIndexOf("\/"));
    if (nextFilepath) {
      await traverseContent(nextFilepath);
    }
  }
}

module.exports = { traverseContent }
