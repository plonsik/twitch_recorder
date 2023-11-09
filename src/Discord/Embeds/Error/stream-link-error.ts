import {EmbedBuilder} from 'discord.js';

export const createStreamlinkErrorEmbed = (errorTitle: string, errorDescription: string) => {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`Error: ${errorTitle}`)
    .setDescription(errorDescription);
};
