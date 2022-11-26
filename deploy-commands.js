import { REST, Routes } from 'discord.js';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// eslint-disable-next-line no-restricted-syntax
for (const file of commandFiles) {
  // eslint-disable-next-line no-await-in-loop
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// and deploy your commands!
(async () => {
  // DEV
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
    { body: commands },
  );
  // PROD
  // await rest.put(
  //   Routes.applicationCommands(process.env.CLIENT_ID),
  //   { body: commands },
  // );
})();
