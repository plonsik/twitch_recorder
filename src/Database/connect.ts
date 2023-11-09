import {logger} from '../logs/system-logger/logger';
import {sequelize} from './sequelize';
import {syncDatabaseTables} from './sync';

export const connectToSqliteDatabase = async () => {
  try {
    await sequelize.authenticate();
    await syncDatabaseTables();

    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};
