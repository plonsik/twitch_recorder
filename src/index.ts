import {connectToSqliteDatabase} from './database/connect';
import {connectToDiscord} from './discord/client/connect';

const main = async () => {
  await connectToSqliteDatabase();
  await connectToDiscord();
};

main();
