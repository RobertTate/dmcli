const inquirer = require('inquirer');
const chalk = require('chalk');

const { traverse5eApi } = require('./traverse5eApi');

async function search5eContent() {
  const goBackButton = chalk.red.bold('Go Back');
  let keepGoing = true;
  const menuItems = {
    "Classes": "classes",
    "Conditions": "conditions",
    "Damage Types": "damage-types",
    "Equipment": "equipment",
    "Languages": "languages",
    "Magic Items": "magic-items",
    "Magic Schools": "magic-schools",
    "Monsters": "monsters",
    "Proficiencies": "proficiencies",
    "Races": "races",
    "Spells": "spells"
  }

  while(keepGoing) {
    console.clear();
    let { selected5eContent } = await inquirer.prompt({
      type: 'list',
      name: 'selected5eContent',
      message: `What ${chalk.blue.bold('D&D 5e')} content are you looking for?`,
      choices: [
        ...Object.keys(menuItems),
        goBackButton
      ]
    });
  
    if (selected5eContent === goBackButton) {
      keepGoing = false;
    } else {
      console.clear();
      let urlSegment = menuItems[selected5eContent]
      await traverse5eApi(urlSegment);
    }
  }
}

module.exports = search5eContent;
