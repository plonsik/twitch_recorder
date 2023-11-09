import {Writable} from 'node:stream';
import pino, {multistream} from 'pino';
import pretty from 'pino-pretty';
import {TextChannel} from 'discord.js';
import {DiscordClient} from '../../discord/client/client';
import {SystemLog} from '../../models/system-log';
import {createAppErrorEmbed} from '../../discord/embeds/error/app-error';

export function createDatabaseStream() {
  return new Writable({
    objectMode: true,
    write(chunk, _, callback) {
      const log = typeof chunk === 'object' ? chunk : JSON.parse(chunk.toString());

      SystemLog.create({
        level: pino.levels.labels[log.level],
        message: log.msg,
      })
        .then(() => callback())
        .catch((err) => callback(err));
    },
  });
}

export function createDiscordStream() {
  return new Writable({
    objectMode: true,
    write(chunk, _, callback) {
      const log = typeof chunk === 'object' ? chunk : JSON.parse(chunk.toString());

      if (log.level !== pino.levels.values.error) {
        callback();
        return;
      }

      const embed = createAppErrorEmbed(log.msg, log.stack || 'No stack trace available');
      const channel = DiscordClient.channels.cache.get('1163245140803076116') as TextChannel;

      channel
        .send({embeds: [embed]})
        .then(() => callback())
        .catch((err) => callback(err));
    },
  });
}

export const logger = pino(
  {
    level: 'info',
  },
  multistream([pretty(), createDatabaseStream(), createDiscordStream()]),
);
