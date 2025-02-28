import { IReturnSomethingWrong } from 'src/types';

export const MONGO_DB_URL =
  'mongodb+srv://zohaib68:pakistan68@cluster0.nl70v.mongodb.net/School?retryWrites=true&w=majority';

export const ROOT_DB_CONNECTION_STRING = 'DATABASE_CONNECTION';

export const USERS_MODEL_STRING = 'USERS_MODEL';

export const GRADES_MODEL_STRING = 'GRADES_MODEL';

export const SECTIONS_MODEL_STRING = 'SECTIONS_MODEL';

export const RETURN_SOME_THING_WENT_WRONG: IReturnSomethingWrong = {
  message: 'Something went wrong',
};

export const JWT_AUTH_SECRET_KEY = 'my_super_secret_key_12345';
