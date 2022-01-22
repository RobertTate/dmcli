const fs = require('fs');
const { join } = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');
const prettyoutput = require('prettyoutput');

const { prettyStyle, warningLog } = require('../styles/chalkFunctions');

async function editContentItem(datapath) {
  const backButton = chalk.red.bold('Go Back');
  let keepGoing = true;

  const updateLinks = async (content, datapath) => {
    let keepUpdatingLinks = true;
    const editLinksButton = 'Edit Links';
    const addLinkButton = 'Add a Link';
    const removeLinkButton = 'Remove a Link';

    while (keepUpdatingLinks) {
      let linkOptions = [addLinkButton];

      if (content.data['Links'].length > 0) {
        linkOptions.push(removeLinkButton);
        linkOptions.push(editLinksButton);
      };

      console.log(prettyStyle('Current Links:'));
      console.log(prettyoutput(content.data['Links']));

      const { linkOption } = await inquirer.prompt({
        type: 'list',
        name: 'linkOption',
        message: `Select an Option for your ${prettyStyle('Links')} Section:`,
        choices: [
          ...linkOptions,
          backButton
        ]
      });

      if (linkOption === backButton) {
        console.clear();
        keepUpdatingLinks = false;
      } else if (linkOption === addLinkButton) {
        let { newLink } = await inquirer.prompt({
          type: 'input',
          name: 'newLink',
          message: `Add a ${prettyStyle('Link')}:`,
          validate: (value) => {
            const pass = value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (pass) {
              return true;
            }
            return 'Please enter a valid url (must include www).';
          }
        });
        content.data['Links'].push(newLink);
        fs.writeFileSync(
          join(__basedir, datapath),
          JSON.stringify(content),
          (err) => {
            warningLog(err);
          }
        );
        console.clear();
      } else if (linkOption === removeLinkButton) {
        let { linkToRemove } = await inquirer.prompt({
          type: 'list',
          name: 'linkToRemove',
          message: `Please Select a ${prettyStyle('Link')} to Remove:`,
          choices: [
            ...content.data['Links'],
            backButton
          ]
        });
        if (linkToRemove === backButton) {
          console.clear();
        } else {
          content.data['Links'].splice(content.data['Links'].indexOf(linkToRemove), 1);
          fs.writeFileSync(
            join(__basedir, datapath),
            JSON.stringify(content),
            (err) => {
              warningLog(err);
            }
          );
          console.clear();
        }
      } else if (linkOption === editLinksButton) {
        let { linkToEdit } = await inquirer.prompt({
          type: 'list',
          name: 'linkToEdit',
          message: `Please Select a ${prettyStyle('Link')} to Edit:`,
          choices: [
            ...content.data['Links'],
            backButton
          ]
        });

        if (linkToEdit === backButton) {
          console.clear();
        } else {
          let { editedLink } = await inquirer.prompt({
            type: 'input',
            name: 'editedLink',
            message: `Enter new value for ${prettyStyle(linkToEdit)}:`,
            validate: (value) => {
              const pass = value.match(/(http(s)?:\/\/.)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
              if (pass) {
                return true;
              }
              return 'Please use a valid url.';
            }
          });

          let { confirmEditLink } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirmEditLink',
            message: 'Are you sure you want to update this link? '
          });

          if (confirmEditLink) {
            content.data['Links'][content.data['Links'].indexOf(linkToEdit)] = editedLink;
            fs.writeFileSync(
              join(__basedir, datapath),
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


  const updateText = async (content, datapath) => {
    console.log(prettyStyle('Previous Text:'));
    console.log(content.data['Text'] || "(Text is empty)");
    let { newText } = await inquirer.prompt({
      type: 'input',
      name: 'newText',
      message: `Enter New Text for your ${prettyStyle('Text')} Section`
    });

    let { confirmNewText } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmNewText',
      message: `Are you sure you want to update this text? `
    });

    if (confirmNewText) {
      content.data['Text'] = newText;
      fs.writeFileSync(
        join(__basedir, datapath),
        JSON.stringify(content),
        (err) => {
          warningLog(err);
        }
      );
      console.clear();
    } else {
      console.clear();
    }
  }


  const updateTopics = async (content, datapath) => {
    let keepUpdatingTopics = true;
    const editTopicsButton = 'Edit Topics';
    const addTopicButton = 'Add a Topic';
    const removeTopicButton = 'Remove a Topic';

    while (keepUpdatingTopics) {
      let topicOptions = [addTopicButton];

      if (Object.keys(content.data['Topics']).length > 0) {
        topicOptions.push(removeTopicButton);
        topicOptions.push(editTopicsButton);
      };

      console.log(prettyStyle('Current Topics:'));
      console.log(prettyoutput(Object.keys(content.data['Topics'])));

      const { topicOption } = await inquirer.prompt({
        type: 'list',
        name: 'topicOption',
        message: `Select an Option for your ${prettyStyle('Topics')} Section:`,
        choices: [
          ...topicOptions,
          backButton
        ]
      });

      if (topicOption === backButton) {
        console.clear();
        keepUpdatingTopics = false;
      } else if (topicOption === addTopicButton) {
        let { newTopicName } = await inquirer.prompt({
          type: 'input',
          name: 'newTopicName',
          message: `Add a ${prettyStyle('Topic')} Name:`,
        });

        let { newTopicValue } = await inquirer.prompt({
          type: 'input',
          name: 'newTopicValue',
          message: `Add the text that will display for this ${prettyStyle('Topic')}:`,
        })

        content.data['Topics'][newTopicName] = newTopicValue;

        fs.writeFileSync(
          join(__basedir, datapath),
          JSON.stringify(content),
          (err) => {
            warningLog(err);
          }
        );
        console.clear();
      } else if (topicOption === removeTopicButton) {
        let { topicToRemove } = await inquirer.prompt({
          type: 'list',
          name: 'topicToRemove',
          message: `Please Select a ${prettyStyle('Topic')} to Remove:`,
          choices: [
            ...Object.keys(content.data['Topics']),
            backButton
          ]
        });

        if (topicToRemove === backButton) {
          console.clear();
        } else {

          let { confirmRemoveTopic } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirmRemoveTopic',
            message: 'Are you sure you want to remove this topic? '
          });

          if (confirmRemoveTopic) {
            delete content.data['Topics'][topicToRemove];
            fs.writeFileSync(
              join(__basedir, datapath),
              JSON.stringify(content),
              (err) => {
                warningLog(err);
              }
            );
            console.clear();
          }
        }
      } else if (topicOption === editTopicsButton) {
        let { topicToEdit } = await inquirer.prompt({
          type: 'list',
          name: 'topicToEdit',
          message: `Please Select a ${prettyStyle('Topic')} to Edit:`,
          choices: [
            ...Object.keys(content.data['Topics']),
            backButton
          ]
        });

        if (topicToEdit === backButton) {
          console.clear();
        } else {
          console.clear();
          console.log(prettyStyle('Current Text:'))
          console.log(prettyoutput(content.data['Topics'][topicToEdit]));

          let { editedTopic } = await inquirer.prompt({
            type: 'input',
            name: 'editedTopic',
            message: `Enter new value for ${prettyStyle(topicToEdit)}:`
          });

          let { confirmEditTopic } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirmEditTopic',
            message: 'Are you sure you want to update this topic? '
          })

          if (confirmEditTopic) {
            content.data['Topics'][topicToEdit] = editedTopic;

            fs.writeFileSync(
              join(__basedir, datapath),
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


  const contentItemFunctionMap = {
    "Links": updateLinks,
    "Text": updateText,
    "Topics": updateTopics
  }


  while (keepGoing) {
    let content = JSON.parse(fs.readFileSync(join(__basedir, datapath), 'utf8', 'r'));
    const { data } = content

    const { option } = await inquirer.prompt({
      type: 'list',
      name: 'option',
      message: `Select which ${chalk.magentaBright.bold('Content Item')} to ${chalk.magentaBright.bold('Edit')}:`,
      choices: [
        ...Object.keys(data),
        backButton
      ]
    });

    console.clear();

    if (option === backButton) {
      keepGoing = false;
    } else {
      await contentItemFunctionMap[option](content, datapath);
    }
  }
};

module.exports = { editContentItem };
