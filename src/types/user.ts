import { Types } from 'mongoose';

interface userJSON{
    _id: Types.ObjectId, 
    name: string, 
    age: number, 
    email: string, 
    createdAt: Date,
    updatedAt: Date,
}

export {userJSON}