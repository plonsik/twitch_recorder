import cron from 'node-cron';
import {TextChannel} from 'discord.js';
import {DiscordClient} from '../discord/client/client';

cron.schedule('0 0 19 * *', () => {
  const discordChannelId = '1155268622776815668';
  const channel = DiscordClient.channels.cache.get(discordChannelId);
  const textChannel = channel as TextChannel;

  if (textChannel) {
    textChannel.send(
      '<@520954729585573912>, <@208563885710639104>, daj suba kulawemu. https://www.twitch.tv/mamm0n',
    );
  }
});
