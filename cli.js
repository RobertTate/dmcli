#!/usr/bin/env node

const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');
const open = require('open');

const { showBanner } = require('./src/styles/showBanner');
const { getCampaignContent } = require('./src/campaign_navigation/getCampaignContent');
const { createNewCampaign, removeCampaign } = require('./src/campaign_navigation/campaignCreation');
const InitiativeTracker = require('./src/initiative_tracking/initiativeTracker');
const search5eContent = require('./src/fifth_edition_api/search5eContent');

global.__basedir = __dirname;

( async () => {
  let keepGoing = true;

  console.clear();

  while (keepGoing) {
    showBanner();

    const createNewCampaignButton = chalk.magentaBright.bold('Create a New Campaign');
    const deleteACampaignButton = chalk.hex('#ff9c08').bold('Delete a Campaign');
    const initiativeButton = chalk.greenBright.bold('Roll Initiative');
    const openCampaignDirectory = chalk.yellow.bold('Open Campaigns Folder');
    const search5eContentButton = chalk.blueBright.bold('Search 5e Content');
    const quitButton = chalk.red.bold('Quit');

    const campaignOptions = [createNewCampaignButton]

    const campaigns = fs.readdirSync(join(__basedir,'./campaigns'), 'utf8').filter((item) => {
      return fs.lstatSync(join(__basedir, `./campaigns/${item}`)).isDirectory();
    });

    if (campaigns.length > 0) {
      campaignOptions.push(deleteACampaignButton);
    }

    const { campaign } = await inquirer.prompt({
      type: 'list',
      name: 'campaign',
      message: `Choose Your ${chalk.blue.bold('Campaign')}:`,
      pageSize: 10,
      choices: [
        ...campaigns,
        ...campaignOptions,
        openCampaignDirectory,
        initiativeButton, 
        search5eContentButton, 
        quitButton
      ]
    });

    if (campaign === createNewCampaignButton) {
      await createNewCampaign();
    } else if (campaign === deleteACampaignButton) {
      await removeCampaign(campaigns);
    } else if (campaign === initiativeButton) {
      const it = new InitiativeTracker();
      await it.start();
    } else if (campaign === openCampaignDirectory) {
      await open(join(__basedir,'./campaigns'));
    } else if (campaign === search5eContentButton) {
      await search5eContent();
    } else if (campaign === quitButton) {
      keepGoing = false;
    } else {
      await getCampaignContent(campaign);
    }

    console.clear();
    
    if(campaign === quitButton) {
      console.log(`${chalk.blue.bold('\nThanks for using DMCLI!')}`)
    };
  };
})();
