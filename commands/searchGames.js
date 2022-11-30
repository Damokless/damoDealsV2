import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import updateConfigFile from './updateConfigFile.js';
import config from '../config.json' assert {type: 'json'} ;

const todayDate = new Date();
let totalDeals = 0

function sendEmbed(deal, interaction) {
  totalDeals += 1
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(deal.title)
    .setURL(deal.open_giveaway_url)
    .setDescription(deal.description)
    .addFields(
      { name: '\u200B', value: '\u200B' },
      { name: 'Instructions', value: deal.instructions },
      { name: 'Type', value: deal.type, inline: true },
      { name: 'Prix initial', value: deal.worth, inline: true },
    )
    .setImage(deal.image)
    .setTimestamp()
    .setFooter({ text: 'Made with ❤️ by Damokles', iconURL: 'https://avatars.githubusercontent.com/u/66098929?v=4' });

  config.games ? interaction.client.channels.cache.get(config.games).send({ embeds: [exampleEmbed] }) : interaction.channel.send({ embeds: [exampleEmbed] })
}

const searchGames = {
  data: new SlashCommandBuilder()
    .setName('searchgames')
    .setDescription('search free games for all plateforms'),
  async execute(interaction) { 
    const response = await fetch('https://www.gamerpower.com/api/giveaways?type=game', { method: 'GET' });
    const deals = await response.json();
    // eslint-disable-next-line no-restricted-syntax
    for (const deal of deals) {
      if (deal.published_date > config.lastUpdateGames) {
        sendEmbed(deal, interaction);
      }
    }
    totalDeals === 0 ? await interaction.reply(`Pas de nouveaux deals depuis la dernière utilisation de la commande ${config.lastUpdateGames}`) : await interaction.reply(`J'ai trouvé ${totalDeals} jeux actuellement gratuits`)
    config.lastUpdateGames = todayDate.toISOString().replace('T', ' ').slice(0, -5)
    updateConfigFile(JSON.stringify(config))
    totalDeals = 0
  },
};

export default searchGames;
