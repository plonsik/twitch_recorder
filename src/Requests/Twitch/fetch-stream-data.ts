import axios from 'axios';
import {STREAMER_NAME, CLIENT_ID} from '../../constants';
import {logger} from '../../logs/system-logger/logger';
import {SystemState} from '../../state/system';
import {PartialStream} from './check-is-streamer-online';

type Response = {
  data: PartialStream[];
};

export const fetchStreamData = async (): Promise<PartialStream | null> => {
  try {
    const {data: response} = await axios.get<Response>(
      `https://api.twitch.tv/helix/streams?user_login=${STREAMER_NAME}`,
      {
        headers: {
          'Client-ID': CLIENT_ID,
          Authorization: `Bearer ${SystemState.accessToken}`,
        },
      },
    );

    const streamData = response.data.find((streamer) => streamer.user_login === STREAMER_NAME);

    if (!streamData) {
      logger.error('Error fetching stream data.');

      return null;
    }

    return streamData;
  } catch {
    logger.error('Error fetching stream data.');

    return null;
  }
};
