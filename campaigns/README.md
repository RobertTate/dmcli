# ⚡ Welcome to DMCLI! ⚡

You're currently in the campaigns folder. You know what you should put it in? Your campaign content. Here's an example of how to add some:

Lets say I want to break up my campaign content by both `Places`, and `Events`. To do this: 

* First, decide on your top level campaign folder name and create it here. Let's just say you decided to call your campaign `Umsvarladden`.

* Then, inside `Umsvarladden`, make subfolders called `Places`, and `Events`.

- Then, inside those folders, keep going. Break up your content with more subfolders however it makes sense to you.

- Once you get to a place where you feel like there should actually be content there, instead of more folders, add a file there and name it: `data.json`.

The `data.json` file must follow this structure:

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

You've got a few options within each section of the json file:

## Links
Accepts an array of url's. Selecting this option while using DMCLI will result in all the urls in the array opening in new tabs in your default browser. I find this super helpful if I am running an encounter and need a quick way to get all of the monster stats in front of me.

## Text
A place to put text. Selecting this option while using DMCLI will display the text. Use how you see fit. I like using this for a more general overview type of blurb, for what this section of content represents.

## Topics
Accepts as many topics as you want. Selecting this option while using DMCLI will take you to another dropdown, showing the topics. From there, you can select one to display its text.

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

---

*That's all for now! Happy DM'ing* 😄
