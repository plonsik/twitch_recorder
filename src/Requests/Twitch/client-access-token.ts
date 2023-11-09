import axios from 'axios';
import {CLIENT_ID, CLIENT_SECRET} from '../../constants';
import axiosRetry from 'axios-retry';
import {logger} from '../../logs/system-logger/logger';

type Response = {
  access_token: string;
};

axiosRetry(axios, {
  retries: 5,
  retryDelay: () => 1000,
  retryCondition: ({response}) => response?.status !== 200,
});

export const getClientAccessToken = async (): Promise<string> => {
  try {
    const {data: response} = await axios.post<Response>('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });

    logger.info(response, 'Successfully fetched client access token.');

    return response.access_token;
  } catch {
    logger.error('Error fetching client access token, after 5 retries.');

    // TODO: send Discord message, including error
    process.exit();
  }
};
