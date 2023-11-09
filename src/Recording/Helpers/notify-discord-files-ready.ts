import {TextChannel, ChannelType} from 'discord.js';
import {createFilesReadyEmbed} from '../../discord/embeds/info/files-ready';
import {StreamState} from '../../state/stream';
import {formatDateTime} from '../../utils/date/format-date-time';
import {DiscordClient} from '../../discord/client/client';

export const notifyDiscordFilesReady = async () => {
  const discordChannelId = '1155268622776815668';
  const channel = DiscordClient.channels.cache.get(discordChannelId);
  const textChannel = channel as TextChannel;

  if (textChannel && textChannel.type === ChannelType.GuildText) {
    await textChannel.send({
      embeds: [createFilesReadyEmbed(`stream_${formatDateTime(StreamState.streamStartDate)}`)],
    });
  }
};
