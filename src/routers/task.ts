import Task, { ITask } from "../models/task";
import { Router, Response } from "express";
import { userRequest } from "../types/user";
import { auth } from "../middleware/auth";

const taskRouter = Router()

taskRouter.post('/task', auth, async (req: userRequest<{}, {}, ITask>, res: Response) => {
    try {
        if (!req.user) {
            throw new Error();
        }
        const task = new Task({ ...req.body, owner: req.user?._id })
        await task.save();
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.get('/tasks', auth, async (req: userRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new Error('no user found');
        }
        const populatedUser = await req.user.populate<{ tasks: Array<ITask> }>('tasks')
        const userInfo = await populatedUser.toJSON()

        res.send(userInfo)
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

export default taskRouter;
