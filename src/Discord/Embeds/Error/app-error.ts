import {EmbedBuilder} from 'discord.js';

export const createAppErrorEmbed = (stringMessage: string, catchedError: any) => {
  return new EmbedBuilder()
    .setColor('#8B4513')
    .setTitle('Error occured!')
    .addFields(
      {name: 'Message: ', value: stringMessage},
      {name: 'Error message: ', value: catchedError},
    );
};
