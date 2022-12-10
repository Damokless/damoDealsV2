import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import updateConfigFile from './updateConfigFile.js';

// open DB
const db = await open({
  filename: './config.db',
  driver: sqlite3.Database,
});

// Init variables needed
let totalDeals = 0;
const gamesLastUpdate = await db.get('SELECT gamesLastUpdate FROM config');
const gamesChannelID = await db.get('SELECT gamesChannelID FROM config');

function sendEmbed(deal, interaction) {
  totalDeals += 1;
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(deal.title)
    .setURL(deal.open_giveaway_url)
    .setDescription(deal.description)
    .addFields(
      { name: '\u200B', value: '\u200B' },
      { name: 'Instructions', value: deal.instructions },
      { name: 'Plateformes', value: deal.platforms, inline: true },
      { name: 'Prix initial', value: deal.worth, inline: true },
    )
    .setImage(deal.image)
    .setTimestamp()
    .setFooter({ text: 'Made with ❤️ by Damokles', iconURL: 'https://avatars.githubusercontent.com/u/66098929?v=4' });

  /* It's checking if the gamesChannelID is set. If yes,it will send the embed to the
  channel set in the config.db. If it's not, it will send the embed to the channel where the command
  was executed. */
  gamesChannelID ? interaction.client.channels.cache.get(gamesChannelID).send({ embeds: [exampleEmbed] }) : interaction.channel.send({ embeds: [exampleEmbed] });
}

const searchGames = {
  data: new SlashCommandBuilder()
    .setName('searchgames')
    .setDescription('search free games for all plateforms'),
  async execute(interaction) {
    /* It's fetching the data from the API and converting it to JSON. */
    const response = await fetch('https://www.gamerpower.com/api/giveaways?type=game', { method: 'GET' });
    const deals = await response.json();

    /* Looping through the deals and checking if the deal was published after the last update. */
    // eslint-disable-next-line no-restricted-syntax
    for (const deal of deals) {
      if (deal.published_date > gamesLastUpdate || gamesLastUpdate === undefined) {
        sendEmbed(deal, interaction);
      }
    }

    // Update last research date and time
    await updateConfigFile('gamesLastUpdate', 'strftime(\'%Y-%m-%d %H:%M:%S\', \'now\')');

    // eslint-disable-next-line no-unused-expressions
    totalDeals === 0 ? await interaction.reply('Pas de nouveaux deals depuis la dernière utilisation de la commande') : await interaction.reply(`J'ai trouvé ${totalDeals} jeux actuellement gratuits`);
    totalDeals = 0;
  },
};

export default searchGames;
