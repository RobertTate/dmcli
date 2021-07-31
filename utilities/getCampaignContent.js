const { traverseContent } = require('./traverseContent');

async function getCampaignContent(campaign) {
  await traverseContent(campaign);
}

module.exports = { getCampaignContent }
