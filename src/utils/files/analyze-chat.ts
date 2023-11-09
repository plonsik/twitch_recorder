import {TextChannel} from 'discord.js';
import {ChatMessage} from '../../models/chat-message';
import {createChatAnalysisResultEmbed} from '../../discord/embeds/chat/chat-analysis-result';
import {DiscordClient} from '../../discord/client/client';

type ActivityWindow = {
  [key: number]: number;
};

type InterestingRange = [string, string];

const EXPRESSIONS = [
  {term: 'xd', regex: /x+d+/gi},
  {term: 'shizo', regex: /\bshizo\b/gi},
  {term: 'joker', regex: /\bjoker\b/gi},
  {term: 'j0ker', regex: /\bj0ker\b/gi},
];
const THRESHOLD = 3;

const timestampToHms = (timestamp: Date): string => {
  const hours = timestamp.getUTCHours().toString().padStart(2, '0');
  const minutes = timestamp.getUTCMinutes().toString().padStart(2, '0');
  const seconds = timestamp.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const hmsToSeconds = (hms: string): number => {
  const [hours, minutes, seconds] = hms.split(':').map(Number);
  return seconds + minutes * 60 + hours * 3600;
};

const sendAnalysisToDiscord = async (content: string) => {
  const discordChannelId = '1155295119759655024';
  const channel = await DiscordClient.channels.fetch(discordChannelId);
  const textChannel = channel as TextChannel;
  const embed = createChatAnalysisResultEmbed(content);
  await textChannel.send({embeds: [embed]});
};

export const analyzeChat = async (streamId: number, WINDOW_SIZE: number = 3600): Promise<void> => {
  const activity: ActivityWindow = {};
  const expressionActivity: {[term: string]: ActivityWindow} = {};

  for (let {term} of EXPRESSIONS) {
    expressionActivity[term] = {};
  }

  const chatMessages: ChatMessage[] = await ChatMessage.findAll({where: {streamId: streamId}});

  chatMessages.forEach((chat) => {
    const timestamp = chat.createdAt;
    const window = Math.floor(hmsToSeconds(timestampToHms(timestamp)) / WINDOW_SIZE);
    activity[window] = (activity[window] || 0) + 1;

    for (let {term, regex} of EXPRESSIONS) {
      const termCount = (chat.message.match(regex) || []).length;
      if (termCount > 0) {
        expressionActivity[term][window] = (expressionActivity[term][window] || 0) + termCount;
      }
    }
  });

  const averageActivity: number = calcAverage(Object.values(activity));
  const stddevActivity: number = calcStdDev(Object.values(activity), averageActivity);

  const interestingWindows: string[] = Object.keys(activity).filter(
    (window) => activity[parseInt(window)] > averageActivity + stddevActivity,
  );

  const interestingRanges: InterestingRange[] = interestingWindows.map((window: string) => {
    const startSeconds: number = parseInt(window) * WINDOW_SIZE;
    const endSeconds: number = startSeconds + WINDOW_SIZE;
    return [
      timestampToHms(new Date(startSeconds * 1000)),
      timestampToHms(new Date(endSeconds * 1000)),
    ];
  });

  let resultMessage =
    'General Interesting Activity Ranges:\n' +
    interestingRanges.map((range) => `${range[0]} - ${range[1]}`).join('\n');

  for (let {term} of EXPRESSIONS) {
    const termWindows: string[] = Object.keys(expressionActivity[term]).filter(
      (window) => expressionActivity[term][parseInt(window)] >= THRESHOLD,
    );

    const termRanges: InterestingRange[] = termWindows.map((window: string) => {
      const startSeconds: number = parseInt(window) * WINDOW_SIZE;
      const endSeconds: number = startSeconds + WINDOW_SIZE;
      return [
        timestampToHms(new Date(startSeconds * 1000)),
        timestampToHms(new Date(endSeconds * 1000)),
      ];
    });

    resultMessage +=
      `\n\nInteresting Ranges for ${term}:\n` +
      termRanges.map((range) => `${range[0]} - ${range[1]}`).join('\n');
  }

  await sendAnalysisToDiscord(resultMessage);
};

const calcAverage = (values: number[]): number => {
  const sum: number = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

const calcStdDev = (values: number[], average: number): number => {
  const squareDiffs: number[] = values.map((value) => (value - average) ** 2);
  const avgSquareDiff: number = calcAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};
