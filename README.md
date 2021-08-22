# DMCLI - A Command Line Tool for Dungeon Masters.

![](./images/dmcli-main-menu.jpg?raw=true)

DMCLI is a tool that makes it easier to organize and reference your notes as a dungeon master, while also allowing you to feel like you're a hacker from an 80's movie.

# How do I install DMCLI?

```
npm install -g @robert-tate/dmcli
```

# How do I use DMCLI? 

* Start the CLI by typing `dmcli` in your terminal.

* To add your first campaign, select the `Open Campaigns Folder` option from the main menu.

* Inside the `campaigns` folder, add whatever kind of folder structure you want for organizing your content.

For instance, your folder structure could look like:

`campaigns\Phandelver\01 - Goblin Arrows\01 - Goblin Ambush\data.json`

Once you are in a folder where you want to add content...you'll need to add a json file, named `data.json`.

This is an example of what the json structure should look like in order to use the tool:

```json
{
  "data": {
    "Links": [
      "https://5e.tools/bestiary.html#goblin_mm"
    ],
    "Text": "Read the boxed text on Page 6. This is the first encounter of the campaign.",
    "Topics": {
      "Inspect the horses": "The saddlebags have been looted. Nearby is an empty leather map case.",
      "What the Goblins Know": "Can be found on page 8 of the DM Book",
      "What happens if the Goblins win": "The players wake up uncouncious, looted, wagon gone. They should continue to Phandalin, buy new gear, return to the ambush site, and find the goblin's trail to Cragmaw Hideout.",
      "The Goblin Trail": "With a DC 10 Survival Check - the players learn more about the trail north to Cragmaw Hideout. They can see signs of two human sized bodies being hauled away from the ambush site.The trail is 5 miles before reaching the hidout.\n\nCONFIRM MARCHING ORDER.\n\n10 minutes in, there's a SNARE that will snag someones leg and pull them 10 feet into the air, if they fail a DC 10 Dex Saving Throw. If not carefully lowered down, the player takes 1D6 bludgeoning damage.\n\n10 more minutes in, there's a PIT trap. DC 15 Perception needed to detect. DC 10 Dex Saving throw to not fall in."
    }
  }
}
```
---
You've got a few options within each section of the json file:

## Links
Accepts an array of url's. Selecting this option while using DMCLI will result in all the urls in the array opening in new tabs in your default browser.

## Text
A place to put text. Selecting this option while using DMCLI will display the text. Use how you see fit.

## Topics
Accepts as many topics as you want. Selecting this option while using DMCLI will take you to another dropdown, showing the topics. From there, you can select one to display its text.

# Roll Initiative!
You can find this option in every content item, and also at the main menu. It doesn't require anything added to the content's `data.json` file. Selecting this option will start up an initiative tracker tool.

# Campaign Configurations
For each campaign, you can put one file named `config.json` inside the top level campaign folder. For example:
* `campaigns\Phandelver\config.json`

Inside `config.json` you may add the names of your campaign's players.

```json
{
  "players": ["Sakoontra", "Sigrid", "Soyu", "Wirt", "Ivory Jones"]
}

```

If formatted the same as shown above, the Initiative Tracker can use this configuration to add those players to the encounter automatically.


# Search 5e Content
This option allows you to search a number of types of content from Dungeons and Dragons, 5th Edition. Current selections include **classes, conditions, damage types, equipment, languages, magic items, magic schools, monsters, proficiencies, races,** and **spells**.

Thanks to <a href="https://www.dnd5eapi.co/" target="_blank">D&D 5e API</a>, an open source D&D RESTful API, for supplying this content!

---
*That's all for now! Happy DM'ing* 😄
