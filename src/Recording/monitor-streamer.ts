import {STREAMER_NAME, ONLINE_CHECK_INTERVAL} from '../constants';
import {Stream} from '../models/stream';
import {createStreamInfoEmbed} from '../discord/embeds/info/stream-info';
import {startMessageUpdateLoop} from '../discord/update-service';
import {startChatLogger} from '../logs/chat-logger/logger';
import {logger} from '../logs/system-logger/logger';
import {checkIsStreamerOnline} from '../requests/twitch/check-is-streamer-online';
import {getClientAccessToken} from '../requests/twitch/client-access-token';
import {fetchStreamData} from '../requests/twitch/fetch-stream-data';
import {DiscordState} from '../state/discord';
import {StreamState} from '../state/stream';
import {SystemState} from '../state/system';
import {createStreamFolder} from '../utils/files/create-steam-folder';
import {processRecording} from './process-recording';
import {startRecording} from './start';

export const monitorStreamer = async () => {
  SystemState.accessToken = await getClientAccessToken();

  logger.info('Starting to monitor streamer status.');

  const monitorIntervalId = setInterval(async () => {
    const isStreamerOnline = await checkIsStreamerOnline();

    if (isStreamerOnline) {
      clearInterval(monitorIntervalId);

      const newStream = await new Stream({
        startTime: StreamState.streamStartDate.toLocaleString(),
      }).save();

      StreamState.streamId = newStream.id;
      StreamState.streamStartDate = new Date();
      StreamState.bansTotal = 0;
      StreamState.timeoutsTotal = 0;
      StreamState.maxViewers = 0;
      StreamState.totalMessages = 0;

      const streamData = await fetchStreamData();

      if (streamData) {
        StreamState.streamTitle = streamData.title;
        StreamState.viewerCount = streamData.viewer_count;
        StreamState.games = [
          {
            game: streamData.game_name,
            startDate: new Date(),
            endDate: null,
          },
        ];
      }

      logger.info(`${STREAMER_NAME} is online. Starting recording and chat logging.`);

      await createStreamFolder();

      const updateMessageLoopId = startMessageUpdateLoop();
      const chatClient = startChatLogger();

      const recordingResult = await startRecording();

      //TODO: move to separate func?
      await chatClient.disconnect();
      clearInterval(updateMessageLoopId);
      const endStreamInfoEmbed = createStreamInfoEmbed(new Date().toLocaleString());
      await DiscordState.startMessage!.edit({embeds: [endStreamInfoEmbed]});
      DiscordState.startMessage = null;

      await processRecording(recordingResult);

      setTimeout(monitorStreamer, 60000);
    }
  }, ONLINE_CHECK_INTERVAL);
};
