import tmi from 'tmi.js';
import {STREAMER_NAME} from '../../constants';
import {TextChannel} from 'discord.js';
import {DiscordClient} from '../../discord/client/client';
import {ChatMessage} from '../../models/chat-message';
import {PenaltyLog} from '../../models/penalty-log';
import {createKeywordDetectedEmbed} from '../../discord/embeds/chat/keyword-detected';
import {createUserPunishmentEmbed} from '../../discord/embeds/chat/user-punishment';
import {StreamState} from '../../state/stream';
import {logger} from '../system-logger/logger';

export const startChatLogger = () => {
  const client = new tmi.Client({
    channels: [STREAMER_NAME],
  });

  client
    .connect()
    .then(() => {
      client.on('message', async (_, user, message, self) => {
        if (self) return;

        StreamState.totalMessages++;

        try {
          await ChatMessage.create({
            username: user.username!,
            message: message,
            streamId: StreamState.streamId,
          });
          const lowerCaseMessage = message.toLowerCase();
          if (lowerCaseMessage.includes('bukas') || lowerCaseMessage.includes('tubson')) {
            await sendKeywordMessage(user.username!, message);
          }
        } catch (error) {
          logger.error('Failed to save message to DB:', error);
        }
      });

      client.on('timeout', async (_, username) => {
        StreamState.timeoutsTotal++;

        try {
          await PenaltyLog.create({
            username: username,
            type: 'TIMEOUT',
            streamId: StreamState.streamId,
          });
        } catch (error) {
          logger.error('Failed to save timeout to DB:', error);
        }

        await notifyPunishmentToDiscord(username, 'timeout');
      });

      client.on('ban', async (_, username) => {
        StreamState.bansTotal++;

        try {
          await PenaltyLog.create({
            username: username,
            type: 'BAN',
            streamId: StreamState.streamId,
          });
        } catch (error) {
          logger.error('Failed to save ban to DB:', error);
        }

        await notifyPunishmentToDiscord(username, 'banned');
      });
    })
    .catch(() => {
      logger.error('Could not connect to chat.');
    });

  return {
    client,
    async disconnect() {
      await client.disconnect().catch((error) => {
        logger.error('Failed to disconnect, Error: ', error.message);
      });

      logger.info('Disconnected from chat.');
    },
  };
};

const notifyPunishmentToDiscord = async (username: string, punishmentType: string) => {
  try {
    const userMessages = await getLastMessages(username, 5);
    const embed = createUserPunishmentEmbed(username, punishmentType, userMessages);

    const discordChannelId = '1155287192013394061';
    const channel = await DiscordClient.channels.fetch(discordChannelId);
    const textChannel = channel as TextChannel;

    await textChannel.send({embeds: [embed]});
  } catch (error) {
    logger.error('Error sending Discord message:', error);
  }
};

const getLastMessages = async (username: string, numMessages = 5) => {
  try {
    const messages = await ChatMessage.findAll({
      where: {
        username,
        streamId: StreamState.streamId,
      },
      order: [['createdAt', 'DESC']],
      limit: numMessages,
    });

    return messages.map((message) => message.dataValues.message);
  } catch (error) {
    logger.error('Error fetching messages from DB:', error);
    return [];
  }
};
const sendKeywordMessage = async (username: string, message: string) => {
  try {
    const embed = createKeywordDetectedEmbed(username, message);

    const discordChannelId = '1155287192013394061';
    const channel = await DiscordClient.channels.fetch(discordChannelId);
    const textChannel = channel as TextChannel;

    await textChannel.send({embeds: [embed]});
  } catch (error) {
    logger.error('Error sending Discord keyword alert:', error);
  }
};
