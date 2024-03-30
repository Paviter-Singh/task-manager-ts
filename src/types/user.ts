import { Types } from 'mongoose';
import { userMongo } from '../models/user';
import { Request } from "express";
interface postLoginBody{
    email: string, 
    password: string
}
interface postUserBody extends postLoginBody{
    name: string,
    age: number,
}

interface userJSON{
    _id: Types.ObjectId, 
    name: string, 
    age: number, 
    email: string, 
    createdAt: Date,
    updatedAt: Date,
}

// interface userRequest extends Request{
  
// }
type userRequest = Request & {  user ?: userMongo 
    token?: string }

export {userJSON, postUserBody, postLoginBody, userRequest}