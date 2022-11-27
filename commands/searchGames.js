import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

function sendEmbed(deal, interaction) {
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

  interaction.channel.send({ embeds: [exampleEmbed] });
}

const searchGames = {
  data: new SlashCommandBuilder()
    .setName('searchgames')
    .setDescription('search free games for all plateforms'),
  async execute(interaction) {
    await interaction.reply('Pong!');
    const response = await fetch('https://www.gamerpower.com/api/giveaways?type=game', { method: 'GET' });
    const deals = await response.json();
    // eslint-disable-next-line no-restricted-syntax
    for (const deal of deals) {
      sendEmbed(deal, interaction);
    }
  },
};

export default searchGames;
