const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { showBanner } = require('./utilities/showBanner');
const { getCampaignContent } = require('./utilities/getCampaignContent');

( async () => {
  let keepGoing = true;

  console.clear();
  showBanner();  

  while (keepGoing) {
    const quitButton = chalk.red.bold('Quit');
    const campaigns = fs.readdirSync('./campaigns', 'utf8');
    const { campaign } = await inquirer.prompt({
      type: 'list',
      name: 'campaign',
      message: `Choose Your ${chalk.blue.bold('Campaign')}:`,
      choices: [...campaigns, quitButton]
    });

    if(campaign === quitButton) {
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
