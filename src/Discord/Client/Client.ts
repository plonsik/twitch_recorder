import {Client, GatewayIntentBits} from 'discord.js';
import {onClientReady} from './listeners/client-ready';
import {onMessageCreate} from './listeners/message-create';

export const DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

DiscordClient.once('ready', onClientReady);
DiscordClient.on('messageCreate', onMessageCreate);
