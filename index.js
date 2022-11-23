/* This is importing the discord.js library and the dotenv library. */
import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';

/* Init the discord.js library and the dotenv library. */
dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready display ready!
client.once('ready', () => { console.log('Bot connected'); });


// init client with token
client.login(process.env.BOT_TOKEN);
