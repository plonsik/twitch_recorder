import {EmbedBuilder} from 'discord.js';
import {formatGameLength} from '../../../utils/date/formatGameLength';
import {getFormattedStreamLength} from '../../../utils/date/formatStreamLength';
import {StreamState} from '../../../State/StreamState';

export const createStreamInfoEmbed = (endTime?: string) => {
  const gamesValue = StreamState.games
    .map(({game, startDate, endDate}) => {
      return `${game} - ${formatGameLength(startDate, endDate || new Date())}`;
    })
    .join('\n');

  return new EmbedBuilder()
    .setColor('#8B4513')
    .setTitle('Stream online!')
    .addFields(
      {name: 'Title: ', value: StreamState.streamTitle},
      {name: 'Stream start time: ', value: StreamState.streamStartDate.toLocaleString()},
      {name: 'Stream end time: ', value: endTime || '-'},
      {name: 'Stream length: ', value: getFormattedStreamLength()},
      {name: 'Viewer count: ', value: StreamState.viewerCount.toString()},
      {name: 'Bans total: ', value: StreamState.bansTotal.toString()},
      {name: 'Timeouts total: ', value: StreamState.timeoutsTotal.toString()},
      {name: 'Max viewers: ', value: StreamState.maxViewers.toString()},
      {name: 'Total messages: ', value: StreamState.totalMessages.toString()},
      {name: 'Played games: ', value: gamesValue},
    )
    .setURL('https://www.twitch.tv/mamm0n');
};
