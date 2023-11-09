import {Worker} from 'worker_threads';
import {logger} from '../../logs/system-logger/logger';

export const sendRecordedStreamViaSFTP = () => {
  const worker = new Worker('./src/Workers/sftp-worker.ts');

  worker.on('error', (err) => {
    logger.error('Worker Error:', err.message);
  });

  worker.on('exit', (code) => {
    if (code !== 0) logger.error(`Worker stopped with exit code ${code}`);
  });
};
