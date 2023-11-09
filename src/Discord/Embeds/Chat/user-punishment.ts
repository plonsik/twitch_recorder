import {EmbedBuilder} from 'discord.js';

export const createUserPunishmentEmbed = (
  username: string,
  punishmentType: string,
  userMessages: string[],
) => {
  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`User ${punishmentType}`)
    .setDescription(`**${username}** was ${punishmentType}.`);

  if (userMessages && userMessages.length > 0) {
    embed.addFields({
      name: 'Last messages:',
      value: userMessages
        .slice(0, 5)
        .map((msg) => '- ' + msg)
        .join('\n'),
    });
  } else {
    embed.addFields({name: 'Note', value: 'No recent messages found for this user.'});
  }

  return embed;
};
