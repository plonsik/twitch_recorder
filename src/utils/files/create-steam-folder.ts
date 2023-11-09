import {mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {StreamState} from '../../state/stream';
import {formatDateTime} from '../date/format-date-time';

export const createStreamFolder = async () => {
  await mkdir(
    join(process.env.HOME_PATH!, `stream_${formatDateTime(StreamState.streamStartDate)}`),
    {
      recursive: true,
    },
  );
};
