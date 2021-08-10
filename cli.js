#!/usr/bin/env node

const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');

const { showBanner } = require('./utilities/showBanner');
const { getCampaignContent } = require('./utilities/getCampaignContent');
const InitiativeTracker = require('./utilities/initiativeTracker');

global.__basedir = __dirname;

( async () => {
  let keepGoing = true;

  console.clear();

  while (keepGoing) {
    showBanner();
    const quitButton = chalk.red.bold('Quit');
    const initiativeButton = chalk.greenBright.bold('Roll Initiative!');
    const campaigns = fs.readdirSync(join(__basedir,'./campaigns'), 'utf8').filter((item) => {
      return fs.lstatSync(join(__basedir, `./campaigns/${item}`)).isDirectory();
    });
    const { campaign } = await inquirer.prompt({
      type: 'list',
      name: 'campaign',
      message: `Choose Your ${chalk.blue.bold('Campaign')}:`,
      choices: [...campaigns, initiativeButton, quitButton]
    });

    if(campaign === quitButton) {
      keepGoing = false;
    } else if (campaign === initiativeButton) {
      const it = new InitiativeTracker();
      await it.start();
    } else {
      await getCampaignContent(campaign);
    }

    console.clear();
    
    if(campaign === quitButton) {
      console.log(`${chalk.blue.bold('\nThanks for using DMCLI!')}`)
    };
  };
})();
