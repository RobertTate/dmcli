const inquirer = require('inquirer');

const { actionLog, warningStyle, prettyLog, prettyStyle } = require('./customLogs');

class Character {
  constructor(name, hp, roll) {
    this.name = name;
    this.hp = hp;
    this.roll = roll;
  }
}

class InitiativeTracker {
  constructor() {
    this.characters = [];
    this.keepAddingCharacters = true;
    this.continueEncounter = true;
    this.questions = [
      {
        type: 'input',
        name: 'name',
        message: "What is the character's name?",
      },
      {
        type: 'input',
        name: 'hp',
        message: "How many hit points do they have?",
      },
      {
        type: 'input',
        name: 'roll',
        message: "What did they roll for initiative?",
      }
    ];
  };

  async start() {
    while (this.keepAddingCharacters) {
      await this.addACharacter();
      let nextAction = await this.askToAddAnotherCharacter();
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

  async addACharacter() {
    let { name, hp, roll } = await inquirer.prompt(this.questions);
    this.characters.push(new Character(name, hp, roll));
  };

  async askToAddAnotherCharacter() {
    let { addAnother } = await inquirer.prompt({
      type: 'list',
      name: 'addAnother',
      message: 'Add Another?',
      choices: ['Yes', "No, let's get started", warningStyle('Quit')]
    });
    return addAnother;
  };

  orderCharactersByInitiativeRoll() {
    this.characters.sort((c1, c2) => {
      if (c1.roll < c2.roll) {
        return 1
      } else if (c1.roll > c2.roll) {
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

  showTurnBanner(char) {
    console.log(`Turn: ${prettyStyle(char.name)}. HP: ${warningStyle(char.hp)}`);
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
            }
          ]
        );
        currentCharacter.hp = newHp;
      },
      'End Turn': () => {
        prettyLog(`${currentCharacter.name}'s Turn has Ended!`);
        continueTurn = false;
      },
      'End Encounter': () => {
        actionLog('Heading Back to your Content...');
        continueTurn = false;
        this.continueEncounter = false;
      }
    };

    while (continueTurn) {
      this.showTurnBanner(currentCharacter);
      let { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Options:',
        choices: ['Update HP', 'End Turn', 'End Encounter']
      });
      await processAnswer[choice]();
    }
  }
};

module.exports = InitiativeTracker
