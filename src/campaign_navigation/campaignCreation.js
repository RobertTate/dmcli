const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');
const open = require('open');

const { warningLog, warningStyle, magentaStyle, yellowStyle, actionLog, prettyLog } = require('../styles/chalkFunctions');

async function createNewCampaign() {
  let { newCampaignName } = await inquirer.prompt({
    type: 'input',
    name: 'newCampaignName',
    message: "Please Name Your New Campaign:",
    validate: (value) => {
      const pass = value.match(/^((?![\#\<\>\$\%\`\*\'\"\|\{\}\=\/\\\@]).)+$/);
      if (pass) {
        return true;
      }

      return 'Invalid Character Used.';
    }
  });

  let { confirmCreateCampaign } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmCreateCampaign',
    message: `Create a Campaign Named ${chalk.magentaBright.bold(newCampaignName)}?  `    
  });

  if (confirmCreateCampaign) {
    fs.mkdirSync(join(__basedir,`./campaigns/${newCampaignName}`), {
      recursive: true
    }, (error) => {
      if (error) {
        warningLog(`An error occured while trying to create ${newCampaignName}`);
        warningLog(error);
      }
    })
  }
}

async function createNewFolder(currentFilePath) {
  let { newFolderName } = await inquirer.prompt({
    type: 'input',
    name: 'newFolderName',
    message: "Please Name Your Next Campaign Folder:",
    validate: (value) => {
      const pass = value.match(/^((?![\#\<\>\$\%\`\*\'\"\|\{\}\=\/\\\@]).)+$/);
      if (pass) {
        return true;
      }

      return 'Invalid Character Used.';
    }
  });

  let { confirmCreateFolder } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmCreateFolder',
    message: `Create a Folder Named ${chalk.magentaBright.bold(newFolderName)}?  `    
  });

  if (confirmCreateFolder) {
    fs.mkdirSync(join(__basedir,`./campaigns/${currentFilePath}/${newFolderName}`), {
      recursive: true
    }, (error) => {
      if (error) {
        warningLog(`An error occured while trying to create ${newFolderName}`);
        warningLog(error);
      }
    })
  }
}

async function createNewContentItem(datapath) {
  let { confirmCreateContentItem } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirmCreateContentItem',
    message: `${chalk.magentaBright.bold('Are you sure you want to dedicate this folder to a content item?')} `    
  });

  if (confirmCreateContentItem) {
    const contentItemBoilerplate = {
      "data": {
        "Links": [],
        "Text": "",
        "Topics": {}
      }
    }
    fs.writeFileSync(
      join(__basedir, datapath), 
      JSON.stringify(contentItemBoilerplate),
      (err) => {
        warningLog(err);
      }
    );
  }
}

async function removeCampaign(campaigns) {
  const backButton = warningStyle('Go Back');

  let { campaignToRemove } = await inquirer.prompt({
    type: 'list',
    name: 'campaignToRemove',
    message: 'Select the Campaign You Want to Delete:',
    choices: [
      ...campaigns,
      backButton
    ]
  });

  let { firstConfirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'firstConfirm',
    message: `Are you sure you want to delete ${magentaStyle(campaignToRemove)}? ${warningStyle('This is permanent.')} `
  });

  if (firstConfirm) {
    const openCampaignDirectory = yellowStyle('Open Campaigns Folder');
    const secondConfirm = warningStyle("No. I know what I'm doing. DELETE IT NOW!");

    let { lastChance } = await inquirer.prompt({
      type: 'list',
      name: 'lastChance',
      message: `Do you want to make a backup of your campaign before you delete it?`,
      choices: [
        openCampaignDirectory,
        secondConfirm,
        backButton
      ]
    });

    if (lastChance === secondConfirm) {
      actionLog('Deleting...');
      fs.rmSync(join(__basedir, `./campaigns/${campaignToRemove}`), { recursive: true });
      prettyLog('Campaign Deleted.');
    } else if (lastChance === openCampaignDirectory) {
      await open(join(__basedir,'./campaigns'));
    } else if (lastChance === backButton) {
      actionLog('Returning to Main Menu..');
    }
  }
}

async function removeFolder(currentFilePath, nextFolderOptions) {
  const backButton = warningStyle('Go Back');

  let { folderToRemove } = await inquirer.prompt({
    type: 'list',
    name: 'folderToRemove',
    message: 'Select which folder you wish to remove:',
    choices: [
      ...nextFolderOptions,
      backButton
    ]
  });

  if (folderToRemove !== backButton) {
    let { confirmRemoveFolder } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmRemoveFolder',
      message: `Are you sure you wish to delete this folder? ${warningStyle('This is permanent.')}`
    });

    if (confirmRemoveFolder) {
      actionLog('Deleting...');
      fs.rmSync(join(__basedir, `./campaigns/${currentFilePath}/${folderToRemove}`), { recursive: true });
      prettyLog('Folder Deleted.');
    }
  }
}

module.exports = { 
  createNewCampaign, 
  createNewFolder, 
  createNewContentItem,
  removeCampaign,
  removeFolder
};

