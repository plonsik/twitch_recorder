import {EmbedBuilder} from 'discord.js';

export const createKeywordDetectedEmbed = (user: string, message: any) => {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('Special word detected!')
    .addFields({name: 'User: ', value: user}, {name: 'Message: ', value: message});
};
