const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');

const { processSectionContent } = require('./processSectionContent');
const { createNewFolder, createNewContentItem, removeFolder } = require('./campaignCreation');
const { editCampaignConfig } = require('./editCampaignConfig');
const { warningLog, orangeStyle } = require('../styles/chalkFunctions');

async function traverseContent(filepath) {
  console.clear();

  let currentFilePath = filepath;
  let datapath = `./campaigns/${currentFilePath}/data.json`;
  let headingText = currentFilePath.split('/').pop();

  if (fs.existsSync(join(__basedir, datapath))) {
    let fileLength = fs.readFileSync(join(__basedir, datapath), 'utf8', 'r').length;
    if (fileLength > 0) {
      await processSectionContent(headingText, datapath);
      currentFilePath = updateFilePath(currentFilePath);
      headingText = updateHeadingText(currentFilePath);
    } else {
      fs.unlinkSync(join(__basedir, datapath), (err) => {
        warningLog(err);
      });
    }
  }

  let nextFolderOptions = getFolderContents(currentFilePath);
  const goBackButton = chalk.red.bold('Go Back');
  const createNewFolderButton = chalk.magentaBright.bold('Create a new Folder');
  const removeFolderButton = orangeStyle('Remove a Folder');
  const createNewContentItemButton = chalk.yellowBright.bold('Create a new Content Item');
  const editCampaignConfigButton = chalk.cyanBright.bold('Edit Campaign Config');
  const campaignCreationOptions = [createNewFolderButton];

  if (nextFolderOptions.length === 0) {
    warningLog('This folder is empty!');
    if (currentFilePath.includes('/')) {
      campaignCreationOptions.push(createNewContentItemButton);
    } else {
      campaignCreationOptions.push(editCampaignConfigButton);
    }
  } else {
    campaignCreationOptions.push(removeFolderButton);
    if (!currentFilePath.includes('/')) {
      campaignCreationOptions.push(editCampaignConfigButton)
    }
  }

  const { nextSelection } = await inquirer.prompt({
    type: 'list',
    name: 'nextSelection',
    message: `Choose A ${chalk.blue.bold('Folder')} within ${chalk.yellow.bold(headingText)}:`,
    choices: [
      ...nextFolderOptions,
      ...campaignCreationOptions,
      goBackButton
    ]
  });

  if (nextSelection === createNewFolderButton) {
    await createNewFolder(currentFilePath);
    await traverseContent(currentFilePath);
  } else if (nextSelection === createNewContentItemButton) {
    await createNewContentItem(datapath);
    await traverseContent(currentFilePath);
  } else if (nextSelection === removeFolderButton) {
    await removeFolder(currentFilePath, nextFolderOptions);
    await traverseContent(currentFilePath);
  } else if (nextSelection === editCampaignConfigButton) {
    await editCampaignConfig(currentFilePath);
    await traverseContent(currentFilePath);
  } else if (nextSelection === goBackButton) {
    let nextFilepath = currentFilePath.substr(0, currentFilePath.lastIndexOf("\/"));
    if (nextFilepath) {
      await traverseContent(nextFilepath);
    }
  } else {
    let nextFilepath = `${currentFilePath}/${nextSelection}`;
    await traverseContent(nextFilepath);
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
