const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');

async function getCampaignContent(setCampaign, setChapter, setSection) {
  const campaigns = fs.readdirSync('./campaigns', 'utf8');
  const { campaign } = setCampaign ? { setCampaign } : await inquirer.prompt({
    type: 'list',
    name: 'campaign',
    message: `Choose Your ${chalk.blue.bold('Campaign')}:`,
    choices: campaigns
  });

  console.clear();
  
  const chapters = fs.readdirSync(`./campaigns/${campaign}`, 'utf8');
  const { chapter } = setChapter ? { setChapter } : await inquirer.prompt({
    type: 'list',
    name: 'chapter',
    message: `Choose Your ${chalk.magenta.bold('Chapter')}:`,
    choices: chapters
  });

  console.clear();

  const sections = fs.readdirSync(`./campaigns/${campaign}/${chapter}`, 'utf8');
  const { section } = setSection ? { setSection } : await inquirer.prompt({
    type: 'list',
    name: 'section',
    message: `Choose Your ${chalk.green.bold('Section')}:`,
    choices: sections
  });

  return { campaign, chapter, section };
}

module.exports = { getCampaignContent }
