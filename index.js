const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { getCampaignContent } = require('./utilities/getCampaignContent');
const { processSectionContent } = require('./utilities/processSectionContent');
const { showBanner } = require('./utilities/showBanner');

( async () => {
  let keepGoing = true;

  console.clear();
  showBanner();  

  while (keepGoing) {
    const { campaign, chapter, section } = await getCampaignContent();
    let data;
    let jsonFilePath = `./campaigns/${campaign}/${chapter}/${section}/data.json`;

    console.clear();
    if (fs.existsSync(jsonFilePath)) {
      data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8', 'r'));

      await processSectionContent(data);

      const { nextStep } = await inquirer.prompt({
        type: 'list',
        name: 'nextStep',
        message: `${chalk.red.bold('Do you want to quit?')}:`,
        choices: ['Yes', 'No']
      });
  
      if (nextStep == 'Yes') {
        keepGoing = false;
      };
    } else {
      console.log(chalk.red.bold('No Content Exists for that Section of the Campaign.'));
    }
  };
})();
