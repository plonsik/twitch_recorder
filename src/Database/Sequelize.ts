import {Sequelize, SequelizeOptions} from 'sequelize-typescript';
import {Stream} from '../models/stream';
import {ChatMessage} from '../models/chat-message';
import {PenaltyLog} from '../models/penalty-log';
import {SystemLog} from '../models/system-log';

const SequelizeOptions = {
  dialect: 'sqlite',
  storage: './mitoman.db',
  models: [Stream, ChatMessage, PenaltyLog, SystemLog],
  logging: false,
} satisfies SequelizeOptions;

export const sequelize = new Sequelize(SequelizeOptions);
