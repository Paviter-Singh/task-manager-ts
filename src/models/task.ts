import { Schema, model } from "mongoose"

 interface ITask{
    description: string,
    completed: boolean,
    owner: Schema.Types.ObjectId
 }

const taskSchema = new Schema<ITask>({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = model<ITask>('Task', taskSchema)
export default Task
export {ITask}