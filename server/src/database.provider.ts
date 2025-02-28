import * as mongoose from 'mongoose';
import { MONGO_DB_URL, ROOT_DB_CONNECTION_STRING } from './constants/app';

export const databaseProviders = [
  {
    provide: ROOT_DB_CONNECTION_STRING,
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(MONGO_DB_URL),
    debug: true,
  },
];
