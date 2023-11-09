import {TextChannel, ChannelType} from 'discord.js';
import {createStreamlinkErrorEmbed} from '../../discord/embeds/error/stream-link-error';
import {DiscordClient} from '../../discord/client/client';

export const notifyDiscordStreamlinkError = async (
  exitCode: number | null,
  stderr: string | null,
  stdout: string | null,
) => {
  const discordChannelId = '1155268622776815668';
  const channel = DiscordClient.channels.cache.get(discordChannelId);
  const textChannel = channel as TextChannel;
  const errorEmbed = createStreamlinkErrorEmbed(
    'Streamlink Error',
    `Streamlink encountered an error with exit code: ${exitCode}. STDERR: ${stderr}, STDOUT: ${stdout}`,
  );

  if (textChannel && textChannel.type === ChannelType.GuildText) {
    await textChannel.send({
      embeds: [errorEmbed],
    });
  }
};
