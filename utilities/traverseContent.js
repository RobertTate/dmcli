const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');

const { processSectionContent } = require('./processSectionContent');
const { warningLog } = require('./customLogs');

async function traverseContent(filepath) {
  console.clear();

  let currentFilePath = filepath;
  let datapath = `./campaigns/${currentFilePath}/data.json`;
  let headingText = currentFilePath.split('/').pop();

  if (fs.existsSync(join(__basedir, datapath))) {
    let fileLength = fs.readFileSync(join(__basedir, datapath), 'utf8', 'r').length;
    if (fileLength > 0) {
      let content = JSON.parse(fs.readFileSync(join(__basedir, datapath), 'utf8', 'r'));
      await processSectionContent(content, headingText);
    } else {
      warningLog('There is a data.json file present, but it\'s empty!')
    }
    currentFilePath = updateFilePath(currentFilePath);
    headingText = updateHeadingText(currentFilePath);
  }
  
  let nextFolderOptions = getFolderContents(currentFilePath);

  if (nextFolderOptions.length === 0) {
    warningLog('This folder has no content!');
    currentFilePath = updateFilePath(currentFilePath);
    headingText = updateHeadingText(currentFilePath);
    nextFolderOptions = getFolderContents(currentFilePath);
  }

  const goBackButton = chalk.red.bold('Go Back');

  const { nextFolder } = await inquirer.prompt({
    type: 'list',
    name: 'nextFolder',
    message: `Choose A ${chalk.blue.bold('Folder')} within ${chalk.yellow.bold(headingText)}:`,
    choices: [...nextFolderOptions, goBackButton]
  });

  if (nextFolderOptions.length > 0 && nextFolderOptions.includes(nextFolder)) {
    let nextFilepath = `${currentFilePath}/${nextFolder}`;
    await traverseContent(nextFilepath);
  } else {
    let nextFilepath = currentFilePath.substr(0, currentFilePath.lastIndexOf("\/"));
    if (nextFilepath) {
      await traverseContent(nextFilepath);
    }
  }
}

function getFolderContents(currentFilePath) {
  return fs.readdirSync(join(__basedir, `./campaigns/${currentFilePath}`), 'utf8').filter((item) => {
    return !item.includes('json');
  });
}

function updateFilePath(currentFilePath) {
  return currentFilePath.split("/").slice(0, -1).join('/');
}

function updateHeadingText(headingText) {
  return headingText.split('/').pop();
}

module.exports = { traverseContent }
