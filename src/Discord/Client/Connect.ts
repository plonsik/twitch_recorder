import {BOT_TOKEN} from '../../constants';
import {DiscordClient} from './client';

export const connectToDiscord = async () => {
  await DiscordClient.login(BOT_TOKEN);
};
