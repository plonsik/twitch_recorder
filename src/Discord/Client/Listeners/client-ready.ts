import {logger} from '../../../logs/system-logger/logger';
import {monitorStreamer} from '../../../recording/monitor-streamer';

export const onClientReady = () => {
  logger.info('Connected to Discord.');
  logger.info('Bot started!');

  monitorStreamer();
};
