const mongoose = require('mongoose')
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Model, model, Schema, Types } from "mongoose"
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

import { isValidEmail } from "../utils/validation"
import Task from "./task"
import config from '../types/env'

interface IToken{
    token: string

}
interface IUser{
    name: string,
    email: string, 
    password: string,
    age: number
    tokens: Types.Array<IToken>,
    avatar: Buffer
} 
interface IUserMethods{
    generateAuthToken(): string
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate:{
            validator(value: string) {
                if (!isValidEmail(value)) {
                    // throw new Error('Email is invalid')
                    return false;
                }
                return true
            },
            message: props => `${props.value} is not a valid email!`
        },
        
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: {
            validator(value: string) {
                if (value.toLowerCase().includes('password')) {
                    // throw new Error('Password cannot contain "password"')
                    return false
                }
                return true
            },
            message: props => 'Password cannot contain "password"'
        }
        
    },
    age: {
        type: Number,
        default: 0,
        validate(value: number) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.method('generateAuthToken',async function generateAuthToken(){
    let user = this
    const token: string = jwt.sign({ _id: user._id.toString() }, config.JWT_SECRET)
    user.tokens.push({token})
    await user.save()
    return token
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = model<IUser, UserModel>("User", userSchema)

export default User