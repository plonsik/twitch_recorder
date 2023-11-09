import {TextChannel, ChannelType} from 'discord.js';
import {DiscordClient} from '../../discord/client/client';
import {createStreamlinkErrorEmbed} from '../../discord/embeds/error/stream-link-error';

export const notifyDiscordFilesCorrupted = async () => {
  const discordChannelId = '1155268622776815668';
  const channel = DiscordClient.channels.cache.get(discordChannelId);
  const textChannel = channel as TextChannel;
  const errorEmbed = createStreamlinkErrorEmbed(
    'File Size Error',
    'Recorded stream file size is less than 1MB.',
  );

  if (textChannel && textChannel.type === ChannelType.GuildText) {
    await textChannel.send({
      embeds: [errorEmbed],
    });
  }
};
