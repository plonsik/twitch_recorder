import {logger} from '../logs/system-logger/logger';
import {ChatMessage} from '../models/chat-message';
import {PenaltyLog} from '../models/penalty-log';
import {Stream} from '../models/stream';
import {SystemLog} from '../models/system-log';

export const syncDatabaseTables = async () => {
  try {
    await Stream.sync();
    await PenaltyLog.sync();
    await SystemLog.sync();
    await ChatMessage.sync();

    logger.info('Database tables synced successfully');
  } catch (error) {
    logger.error('Error syncing database tables:', error);
  }
};
