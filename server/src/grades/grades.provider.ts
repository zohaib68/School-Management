import { Connection } from 'mongoose';
import { GRADES_MODEL_STRING, ROOT_DB_CONNECTION_STRING } from 'src/constants';
import { GradesSchema } from './grades.schema';

export const GradessProviders = [
  {
    provide: GRADES_MODEL_STRING,
    useFactory: (connection: Connection) =>
      connection.model('grades', GradesSchema),
    inject: [ROOT_DB_CONNECTION_STRING],
  },
];
