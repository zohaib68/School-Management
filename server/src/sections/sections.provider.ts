import { Connection } from 'mongoose';

import {
  ROOT_DB_CONNECTION_STRING,
  SECTIONS_MODEL_STRING,
} from 'src/constants';
import { SectionsSchema } from './sections.schema';

export const SectionsProviders = [
  {
    provide: SECTIONS_MODEL_STRING,
    useFactory: (connection: Connection) =>
      connection.model('sections', SectionsSchema),
    inject: [ROOT_DB_CONNECTION_STRING],
  },
];
