import { Types } from 'mongoose';
import { userMongo } from '../models/user';

interface postLoginBody {
    email: string,
    password: string
}

interface postUserBody extends postLoginBody {
    name: string,
    age: number,
}

interface userJSON {
    _id: Types.ObjectId,
    name: string,
    age: number,
    email: string,
    createdAt: Date,
    updatedAt: Date,
}

interface UserRequest{
    user: NonNullable<userMongo>;
    token: string;
}

declare global {
  namespace Express {
    export interface Request extends UserRequest {
   
    }
  }
}
export { userJSON, postUserBody, postLoginBody, UserRequest }