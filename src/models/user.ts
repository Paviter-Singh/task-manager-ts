import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Model, model, Schema, Types, Document } from "mongoose"
import { isValidEmail } from "../utils/validation"
import Task from "./task"
import config from '../types/env'
import { postUserBody, userJSON } from '../types/user'

interface IToken {
    token: string
}
interface IUser extends postUserBody {
    tokens: Array<IToken>,
    avatar?: Buffer,
    tasks?: Array<Types.ObjectId>
}
interface IUserMethods {
    generateAuthToken(): Promise<string>,
    toJSON(): Promise<userJSON & { _id: Types.ObjectId }>,
}


type userMongo = (Document<unknown, {}, IUser> & Omit<IUser & {
    _id: Types.ObjectId;
}, keyof IUserMethods> & IUserMethods) | null


interface UserModel extends Model<IUser, {}, IUserMethods> {
    findByCredentials(email: string, password: string): Promise<NonNullable<userMongo>>;
}
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
        validate: {
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
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
  });

userSchema.method('generateAuthToken', async function generateAuthToken() {
    let user = this
    const token: string = jwt.sign({ _id: user._id.toString() }, config.JWT_SECRET, { expiresIn: '12h', algorithm:"HS512"})
    user.tokens.push({ token })
    await user.save()
    return token
})
//this property exits on toObjext but unable to right , createdAt: Date, updatedAt: Date, __v:number
userSchema.method('toJSON', async function toJSON(): Promise<{ _id: Types.ObjectId, name: string, age: number, email: string }> {
    const user = this
    let userObj = user.toObject();
    const { tokens, avatar, password, ...newObj } = userObj;
    return newObj;
})
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.static("findByCredentials", async function (email, password) {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
})
const User = model<IUser, UserModel>("User", userSchema)

export default User

export { userMongo, IToken }