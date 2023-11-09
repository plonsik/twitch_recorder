import {Message} from 'discord.js';

type DiscordState = {
  startMessage: Message<true> | null;
};

export const DiscordState: DiscordState = {
  startMessage: null,
};
