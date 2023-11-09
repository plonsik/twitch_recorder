import {ChannelType, TextChannel} from 'discord.js';
import {fetchStreamData} from '../requests/twitch/fetch-stream-data';
import {DiscordState} from '../state/discord';
import {StreamState} from '../state/stream';
import {DiscordClient} from './client/client';
import {createStreamInfoEmbed} from './embeds/info/stream-info';

export const startMessageUpdateLoop = () => {
  return setInterval(async () => {
    const discordChannelId = '1155268622776815668';
    const channel = DiscordClient.channels.cache.get(discordChannelId);
    const textChannel = channel as TextChannel;

    if (textChannel && textChannel.type === ChannelType.GuildText) {
      const streamData = await fetchStreamData();

      if (streamData) {
        StreamState.streamTitle = streamData.title;
        StreamState.viewerCount = streamData.viewer_count;

        if (StreamState.maxViewers < StreamState.viewerCount) {
          StreamState.maxViewers = StreamState.viewerCount;
        }

        const {game: currentGame} = StreamState.games.at(-1)!;
        if (streamData.game_name !== currentGame) {
          StreamState.games.at(-1)!.endDate = new Date();
          StreamState.games.push({
            game: streamData.game_name,
            startDate: new Date(),
            endDate: null,
          });
        }
      }

      const streamInfoEmbed = createStreamInfoEmbed();

      if (!DiscordState.startMessage) {
        DiscordState.startMessage = await textChannel.send({embeds: [streamInfoEmbed]});
      } else {
        await DiscordState.startMessage.edit({embeds: [streamInfoEmbed]});
      }
    }
  }, 10000);
};
