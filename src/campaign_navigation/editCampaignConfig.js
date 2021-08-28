const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const prettyoutput = require('prettyoutput');

const { warningLog, prettyStyle, warningStyle } = require('../styles/chalkFunctions');

async function editCampaignConfig(campaignName) {
  const configFilePath = join(__basedir, `./campaigns/${campaignName}/config.json`)
  if (!fs.existsSync(configFilePath)) {
    const configBoilerplate = {
      "players": []
    }

    fs.writeFileSync(
      configFilePath,
      JSON.stringify(configBoilerplate),
      (err) => {
        warningLog(err);
      }
    );
  }

  let keepEditingConfig = true;
  const backButton = warningStyle('Go Back');
  const editPlayersButton = 'Add or Remove Players';

  while (keepEditingConfig) {
    console.clear();

    let { editConfigOption } = await inquirer.prompt({
      type: 'list',
      name: 'editConfigOption',
      message: 'Choose a Configuration Option:',
      choices: [
        editPlayersButton,
        backButton
      ]
    });

    if (editConfigOption === backButton) {
      keepEditingConfig = false;
    } else if (editConfigOption === editPlayersButton) {
      let keepEditingPlayers = true;

      while (keepEditingPlayers) {
        console.clear();

        let content = JSON.parse(fs.readFileSync(configFilePath, 'utf8', 'r'));
        console.log(prettyStyle('Current Players:'));
        console.log(prettyoutput(content['players']));

        const addPlayerButton = 'Add a Player';
        const removePlayerButton = 'Remove a Player';
        const playerOptions = [addPlayerButton];

        if (content['players'].length > 0) {
          playerOptions.push(removePlayerButton);
        }

        let { playerOption } = await inquirer.prompt({
          type: 'list',
          name: 'playerOption',
          message: 'Select an Option:',
          choices: [
            ...playerOptions,
            backButton
          ]
        });

        if (playerOption === backButton) {
          keepEditingPlayers = false;
        } else if (playerOption === addPlayerButton) {
          let { newPlayer } = await inquirer.prompt({
            type: 'input',
            name: 'newPlayer',
            message: `Add a Name for your ${prettyStyle('New Player')}:`,
          });
          content['players'].push(newPlayer);
          fs.writeFileSync(
            configFilePath,
            JSON.stringify(content),
            (err) => {
              warningLog(err);
            }
          );
          console.clear();
        } else if (playerOption === removePlayerButton) {
          let { playerToRemove } = await inquirer.prompt({
            type: 'list',
            name: 'playerToRemove',
            message: `Please Select a ${prettyStyle('Player')} to Remove:`,
            choices: [
              ...content['players'],
              backButton
            ]
          });
          if (playerToRemove === backButton) {
            console.clear();
          } else {
            content['players'].splice(content['players'].indexOf(playerToRemove), 1);
            fs.writeFileSync(
              configFilePath,
              JSON.stringify(content),
              (err) => {
                warningLog(err);
              }
            );
            console.clear();
          }
        }
      }
    }
  }
}

module.exports = { editCampaignConfig };
