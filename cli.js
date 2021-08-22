#!/usr/bin/env node

const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');
const open = require('open');

const { showBanner } = require('./utilities/showBanner');
const { getCampaignContent } = require('./utilities/getCampaignContent');
const InitiativeTracker = require('./utilities/initiativeTracker');
const search5eContent = require('./utilities/search5eContent');

global.__basedir = __dirname;

( async () => {
  let keepGoing = true;

  console.clear();

  while (keepGoing) {
    showBanner();

    const initiativeButton = chalk.greenBright.bold('Roll Initiative!');
    const openCampaignDirectory = chalk.yellow.bold('Open Campaigns Folder');
    const search5eContentButton = chalk.blueBright.bold('Search 5e Content');
    const quitButton = chalk.red.bold('Quit');

    const campaigns = fs.readdirSync(join(__basedir,'./campaigns'), 'utf8').filter((item) => {
      return fs.lstatSync(join(__basedir, `./campaigns/${item}`)).isDirectory();
    });
    
    const { campaign } = await inquirer.prompt({
      type: 'list',
      name: 'campaign',
      message: `Choose Your ${chalk.blue.bold('Campaign')}:`,
      choices: [
        ...campaigns,
        initiativeButton, 
        openCampaignDirectory,
        search5eContentButton, 
        quitButton]
    });

    if(campaign === quitButton) {
      keepGoing = false;
    } else if (campaign === search5eContentButton) {
      await search5eContent();
    } else if (campaign === initiativeButton) {
      const it = new InitiativeTracker();
      await it.start();
    } else if (campaign === openCampaignDirectory) {
      await open(join(__basedir,'./campaigns'));
    } else {
      await getCampaignContent(campaign);
    }

    console.clear();
    
    if(campaign === quitButton) {
      console.log(`${chalk.blue.bold('\nThanks for using DMCLI!')}`)
    };
  };
})();
