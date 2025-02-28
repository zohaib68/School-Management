import { Connection } from 'mongoose';
import { UserSchema } from './users.schema';
import { ROOT_DB_CONNECTION_STRING, USERS_MODEL_STRING } from 'src/constants';

export const UsersProviders = [
  {
    provide: USERS_MODEL_STRING,
    useFactory: (connection: Connection) =>
      connection.model('users', UserSchema),
    inject: [ROOT_DB_CONNECTION_STRING],
  },
];
