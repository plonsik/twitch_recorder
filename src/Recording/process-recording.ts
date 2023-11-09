import {stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {logger} from '../logs/system-logger/logger';
import {notifyDiscordFilesCorrupted} from './helpers/notify-discord-files-corrupted';
import {notifyDiscordStreamlinkError} from './helpers/notify-discord-streamlink-error';
import {sendRecordedStreamViaSFTP} from './helpers/upload-stream-via-sftp';

type ExecError = Error & {code?: number};

type RecordingResult = {
  stderr: string | null;
  stdout: string | null;
  error: ExecError | null;
  outputFilename: string;
};

export const processRecording = async (recordingResult: RecordingResult) => {
  const {error, stderr, stdout, outputFilename} = recordingResult;

  if (error) {
    logger.error('Streamlink STDERR:', stderr);

    await notifyDiscordStreamlinkError(error.code || null, stderr, stdout);
  } else if (!error && stderr) {
    logger.warn('Streamlink STDERR without error:', stderr);
    logger.info('Streamlink STDOUT:', stdout);

    await handleSuccessActions(outputFilename);
  } else {
    await handleSuccessActions(outputFilename);
  }
};

const handleSuccessActions = async (outputFilename: string) => {
  try {
    const fileSizeInMB = (await stat(resolve(outputFilename))).size / (1024 * 1024);
    if (fileSizeInMB > 1) {
      sendRecordedStreamViaSFTP();
    } else {
      logger.error('File Size Error: Recorded stream file size is less than 1MB.');

      await notifyDiscordFilesCorrupted();
    }
  } catch (err) {
    logger.error('Error checking the recorded file size:', (err as Error).message);
  }
};
