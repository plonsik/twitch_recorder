import {StreamState} from '../../state/stream';

export const getCurrentTimestamp = () => {
  const now = new Date();
  let elapsedMilliseconds = now.getTime() - StreamState.streamStartDate.getTime();

  const hours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
  elapsedMilliseconds -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(elapsedMilliseconds / (1000 * 60));
  elapsedMilliseconds -= minutes * (1000 * 60);

  const seconds = Math.floor(elapsedMilliseconds / 1000);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
