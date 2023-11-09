import {EmbedBuilder} from 'discord.js';

export const createChatAnalysisResultEmbed = (content: string) => {
  return new EmbedBuilder()
    .setColor('#3498db')
    .setTitle('Chat Analysis Result')
    .setDescription(content);
};
