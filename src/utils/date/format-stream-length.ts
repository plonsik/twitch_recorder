import {StreamState} from '../../state/stream';

export const getFormattedStreamLength = () => {
  const diffInSeconds = (new Date().getTime() - StreamState.streamStartDate.getTime()) / 1000;
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
};
