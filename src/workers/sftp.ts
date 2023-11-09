import {join} from 'node:path';
import sftpClient from 'ssh2-sftp-client';
import {logger} from '../logs/system-logger/logger';
import {notifyDiscordFilesReady} from '../recording/helpers/notify-discord-files-ready';
import {StreamState} from '../state/stream';
import {formatDateTime} from '../utils/date/format-date-time';
const sftp = new sftpClient();

try {
  await sftp.connect({
    host: 'xxxxxxxxxxxx',
    port: 22,
    username: 'xxxxxxxxxxxxxxx',
    password: 'xxxxxxxxxxxxxxx',
  });

  await sftp.fastPut(
    join(
      process.env.HOME_PATH!,
      `stream_${formatDateTime(StreamState.streamStartDate)}`,
      `stream_${formatDateTime(StreamState.streamStartDate)}.mp4`,
    ),
    join(
      '/home/bukas',
      `stream_${formatDateTime(StreamState.streamStartDate)}`,
      `stream_${formatDateTime(StreamState.streamStartDate)}.mp4`,
    ),
  );

  logger.info('Directory transferred successfully');

  await notifyDiscordFilesReady();
} catch (err) {
  logger.error('SFTP Error:', (err as Error).message);
} finally {
  await sftp.end();
}
