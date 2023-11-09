type StreamState = {
  streamStartDate: Date;
  viewerCount: number;
  bansTotal: number;
  timeoutsTotal: number;
  streamTitle: string;
  games: Game[];
  streamId: number;
  totalMessages: number;
  maxViewers: number;
};

type Game = {
  game: string;
  startDate: Date;
  endDate: Date | null;
};

export const StreamState: StreamState = {
  streamStartDate: new Date(),
  viewerCount: 0,
  bansTotal: 0,
  timeoutsTotal: 0,
  streamTitle: '',
  games: [],
  streamId: 0,
  totalMessages: 0,
  maxViewers: 0,
};
