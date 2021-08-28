const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');

const {
  actionLog,
  actionStyle,
  warningLog,
  warningStyle,
  prettyLog,
  prettyStyle,
  blueStyle
} = require('../styles/chalkFunctions');
const ADD_CHARACTER_QUESTIONS = require('../constants/addCharacterQuestions');

class Character {
  constructor(name, hp, roll) {
    this.name = name;
    this.hp = hp;
    this.roll = roll;
  }

  async runChecks() {
    await this.checkForHp();
    await this.checkForRoll();
  }

  async checkForHp() {
    if (!this.hp) {
      let { newHp } = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'newHp',
            message: `Enter ${this.name}'s current HP:`,
            validate(value) {
              const pass = value.match(/^\d+$/);
              if (pass) {
                return true;
              }

              return 'Please enter a valid number';
            }
          }
        ]
      );
      this.hp = newHp;
    }
  }

  async checkForRoll() {
    if (!this.roll) {
      let { newRoll } = await inquirer.prompt(
        [
          {
            type: 'input',
            name: 'newRoll',
            message: `Enter ${this.name}'s Initiative Roll:`,
            validate(value) {
              const pass = value.match(/^\d+$/);
              if (pass) {
                return true;
              }

              return 'Please enter a valid number';
            }
          }
        ]
      );
      this.roll = newRoll;
    }
  }
}

class InitiativeTracker {
  constructor() {
    this.characters = [];
    this.keepAddingCharacters = true;
    this.continueEncounter = true;
  };

  async start() {
    console.clear();

    await this.addConfigCharacters();

    while (this.keepAddingCharacters) {
      let addedCharName = await this.addACharacter();
      prettyLog(`${addedCharName} was added to the encounter!`);
      let nextAction = await this.askToAddAnotherCharacter();
      console.clear();
      if (nextAction === "No, let's get started") {
        this.keepAddingCharacters = false;
      } else if (nextAction === warningStyle('Quit')) {
        this.keepAddingCharacters = false;
        this.continueEncounter = false;
      }
    }

    if (this.continueEncounter) {
      this.orderCharactersByInitiativeRoll();
      await this.runTheEncounter();
    }
  };

  async addConfigCharacters() {
    const campaigns = fs.readdirSync(join(__basedir, './campaigns'), 'utf8').filter((item) => {
      return fs.lstatSync(join(__basedir, `./campaigns/${item}`)).isDirectory();
    });
    const skipButton = warningStyle('Skip');
    const { campaign } = await inquirer.prompt({
      type: 'list',
      name: 'campaign',
      message: `If you have characters preconfigured for your campaign, select that ${blueStyle('campaign')} now:`,
      choices: [...campaigns, skipButton]
    });

    if (campaign !== skipButton) {
      let datapath = `./campaigns/${campaign}/config.json`;
      if (fs.existsSync(join(__basedir, datapath))) {
        let fileLength = fs.readFileSync(join(__basedir, datapath), 'utf8', 'r').length;
        if (fileLength > 0) {
          let campaignConfig = JSON.parse(fs.readFileSync(join(__basedir, datapath), 'utf8', 'r'));
          if (campaignConfig.players && campaignConfig.players.length > 0) {
            let playerNames = campaignConfig.players;
            for (const name of playerNames) {
              let newCharacter = new Character(name);
              await newCharacter.runChecks();
              this.characters.push(newCharacter);
            }
            this.characters.forEach((character) => {
              console.log(`${prettyStyle(character.name)} was added to the encounter!`);
            });
            actionLog('Next, add additional encounter specific characters...');
          } else {
            warningLog('No preconfigured characters exist!');
            actionLog('Moving On...');
          }
        } else {
          warningLog('There is a config.json file present, but it\'s empty!');
          actionLog('Moving On...');
        }
      } else {
        warningLog('No Config File is Present for this campaign');
        actionLog('Moving On...');
      }
    } else {
      actionLog('Moving On...');
    }
  }

  async addACharacter() {
    let { name, hp, roll } = await inquirer.prompt(ADD_CHARACTER_QUESTIONS);
    this.characters.push(new Character(name, hp, roll));
    return name;
  };

  async askToAddAnotherCharacter() {
    let { addAnother } = await inquirer.prompt({
      type: 'list',
      name: 'addAnother',
      message: 'Add Another Character?',
      choices: ['Yes', "No, let's get started", warningStyle('Quit')]
    });
    return addAnother;
  };

  orderCharactersByInitiativeRoll() {
    this.characters.sort((c1, c2) => {
      let roll1 = Number(c1.roll);
      let roll2 = Number(c2.roll);
      if (roll1 < roll2) {
        return 1
      } else if (roll1 > roll2) {
        return -1
      } else {
        return 0
      };
    });
  };

  async runTheEncounter() {
    let turn = 0;
    console.clear();
    while (this.continueEncounter) {
      let currentCharacter = this.characters[turn % this.characters.length]
      await this.processTurn(currentCharacter);
      turn++;
    };
  };

  showCharacterOrder(currentCharacter) {
    this.characters.forEach((char) => {
      if (char === currentCharacter && char.hp <= 0) {
        console.log(`${warningStyle(char.hp)} HP - ${warningStyle(char.name)} <-- Current Turn`);
      } else if (char === currentCharacter) {
        console.log(`${warningStyle(char.hp)} HP - ${prettyStyle(char.name)} <-- Current Turn`);
      } else if (char.hp <= 0) {  
        console.log(`${warningStyle(char.hp)} HP - ${warningStyle(char.name)}`);
      } else {
        console.log(`${warningStyle(char.hp)} HP - ${actionStyle(char.name)}`);
      }
    });
  }

  async processTurn(currentCharacter) {
    let continueTurn = true;
    const processAnswer = {
      'Update HP': async () => {
        let { newHp } = await inquirer.prompt(
          [
            {
              type: 'input',
              name: 'newHp',
              message: "Enter the new HP amount:",
              validate(value) {
                const pass = value.match(/^\d+$/);
                if (pass) {
                  return true;
                }
                return 'Please enter a valid number';
              }
            }
          ]
        );
        currentCharacter.hp = newHp;
      },
      'Update Another Character HP': async () => {
        let backButton = warningStyle('Back');
        let otherCharacters = this.characters.filter((character) => {
          return character !== currentCharacter;
        });
        let { otherCharacterString } = await inquirer.prompt({
          type: 'list',
          name: 'otherCharacterString',
          message: 'Choose the Character You Want to Update:',
          choices: [...otherCharacters, backButton]
        });
        if (otherCharacterString !== backButton) {
          let otherCharacter = otherCharacters.find((character) => {
            return character.name === otherCharacterString;
          });
          console.log(
            `Character: ${prettyStyle(otherCharacter.name)}. HP: ${warningStyle(otherCharacter.hp)}`
          );
          let { newHp } = await inquirer.prompt(
            [
              {
                type: 'input',
                name: 'newHp',
                message: "Enter the new HP amount:",
              }
            ]
          );
          otherCharacter.hp = newHp;
          prettyLog(`${otherCharacter.name}'s HP Has Been Updated!`)
        }
      },
      'End Turn': () => {
        continueTurn = false;
      },
      'End Encounter': () => {
        actionLog('Heading Back to your Content...');
        continueTurn = false;
        this.continueEncounter = false;
      }
    };

    while (continueTurn) {
      this.showCharacterOrder(currentCharacter);
      let { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Options:',
        choices: ['Update HP', 'Update Another Character HP', 'End Turn', 'End Encounter']
      });
      await processAnswer[choice]();
      console.clear();
    }
  }
};

module.exports = InitiativeTracker
