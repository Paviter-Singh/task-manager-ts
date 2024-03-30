import { Types } from 'mongoose';

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
export {userJSON, postUserBody, postLoginBody}