const mongoose = require('mongoose')

import { model, Schema } from "mongoose"
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

import { isValidEmail } from "../utils/validation"
import Task from "./task"

interface IToken{
    token: string

}
interface IUser{
    name: string,
    email: string, 
    password: string,
    age: number
    tokens: IToken[],
    avatar: Buffer
} 

const userSchema = new Schema<IUser>({
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


const User = model<IUser>("User", userSchema)

export default User