import {EmbedBuilder} from 'discord.js';

export const createFilesReadyEmbed = (dirName: string) => {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('Files are ready to download!')
    .addFields({name: 'Directory name: ', value: dirName});
};
