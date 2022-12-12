import { SlashCommandBuilder } from 'discord.js';
import updateConfigFile from '../tools/updateConfigFile.js';

const changeChannel = {
  data: new SlashCommandBuilder()
    .setName('changechannels')
    .setDescription('Command to change the id of the requested channel')
    .addStringOption((option) => option.setName('category')
      .setDescription('choose the category that deserves to change channel')
      .setRequired(true)
      .addChoices(
        { name: 'dlc', value: 'dlcChannelID' },
        { name: 'games', value: 'gamesChannelID' },
      ))
    .addStringOption((option) => option
      .setName('channelid')
      .setRequired(true)
      .setDescription('provide channel id')),
  async execute(interaction) {
    if (interaction.user.id === interaction.guild.ownerId) {
      await updateConfigFile(interaction.options.getString('category'), interaction.options.getString('channelid'));
      await interaction.reply(`${interaction.options.getString('category')} set to ${interaction.options.getString('channelid')}`);
    }
    else {
      await interaction.reply('You don\'t have the permission');
    }
  },
};
export default changeChannel;
