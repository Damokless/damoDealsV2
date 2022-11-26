/* This is importing the discord.js library and the dotenv library. */
import fs from 'fs';
import {
  Client, GatewayIntentBits, Collection, Events,
} from 'discord.js';
import * as dotenv from 'dotenv';

/* Init the discord.js library and the dotenv library. */
dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

/* Importing all the commands from the commands folder. */
const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));
// eslint-disable-next-line no-restricted-syntax
for (const file of commandFiles) {
  // eslint-disable-next-line no-await-in-loop
  const command = await import(`./commands/${file}`);
  if ('data' in command.default && 'execute' in command.default) {
    client.commands.set(command.default.data.name, command);
  }
  else {
    console.log(`[WARNING] The command at /commands/${file} is missing a required "data" or "execute" property.`);
  }
}
/* Importing all the commands from the commands folder. */

/* This is the code that is executed when a command is sent, handle errors and commands matching */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.default.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
/* This is the code that is executed when a command is sent, handle errors and commands matching */


// When the client is ready display ready!
client.once('ready', () => { console.log('Bot connected'); });
// init client with token
client.login(process.env.BOT_TOKEN);
