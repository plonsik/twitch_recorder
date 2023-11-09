import {Message} from 'discord.js';
import {generateTwitchChatImage} from '../../../utils/files/generate-twitch-chat-image';
import {Amonra} from '../../strings/amonra';
import {Shini} from '../../strings/shini';

export const onMessageCreate = async (message: Message<boolean>) => {
  if (message.author.bot) return;
  if (message.channel.id !== '1155345261590233158') return;

  if (message.content.trim() === '!amonra') {
    await message.reply(Amonra);
  }
  if (message.content.trim() === '!shini') {
    await message.reply(Shini);
  }
  if (message.content.startsWith('!twitchMessage')) {
    const regex = /"([^"]+)"\s+"([^"]+)"/;
    const matches = message.content.match(regex);

    if (matches && matches.length === 3) {
      const username = matches[1];
      const chatMessage = matches[2];

      const twitchMessageImage = await generateTwitchChatImage(username, chatMessage);
      message.channel.send({files: [twitchMessageImage]});
    } else {
      message.channel.send('Please use the format: !twitchMessage "username" "message"');
    }
  }
};
