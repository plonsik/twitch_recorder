import {join} from 'node:path';
import {STREAMER_NAME, AUTH_TOKEN} from '../constants';
import {exec} from 'node:child_process';
import {StreamState} from '../state/stream';
import {formatDateTime} from '../utils/date/format-date-time';

type RecordingResult = {
  stderr: string | null;
  stdout: string | null;
  error: Error | null;
  outputFilename: string;
};

export const startRecording = (): Promise<RecordingResult> => {
  return new Promise((resolve) => {
    const outputFilename = join(
      process.env.HOME_PATH!,
      `stream_${formatDateTime(StreamState.streamStartDate)}`,
      `${STREAMER_NAME}_${formatDateTime(StreamState.streamStartDate)}.mp4`,
    );
    const command = `streamlink --twitch-api-header=Authorization=OAuth ${AUTH_TOKEN} --twitch-disable-ads twitch.tv/${STREAMER_NAME} best -o ${outputFilename}`;

    exec(command, (error, stdout, stderr) => {
      resolve({error, stderr, stdout, outputFilename});
    });
  });
};
