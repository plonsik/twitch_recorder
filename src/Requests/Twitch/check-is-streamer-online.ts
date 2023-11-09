import axios from 'axios';
import {STREAMER_NAME, CLIENT_ID} from '../../constants';
import {logger} from '../../logs/system-logger/logger';
import {SystemState} from '../../state/system';

export type PartialStream = {
  game_name: string;
  title: string;
  viewer_count: number;
  user_login: string;
};

type Response = {
  data: PartialStream[];
};

export const checkIsStreamerOnline = async (): Promise<boolean> => {
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

    return Boolean(response.data.find((streamer) => streamer.user_login === STREAMER_NAME));
  } catch {
    logger.error('Error checking if streamer is online.');

    return false;
  }
};
