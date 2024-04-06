import Task, { ITask } from "../models/task";
import { Router, Response, Request } from "express";
import { auth } from "../middleware/auth";
import path from "path";

const taskRouter = Router()

taskRouter.post('/task', auth, async (req: Request<{}, {}, ITask>, res: Response) => {
    try {
        const task = new Task({ ...req.body, owner: req.user?._id })
        await task.save();
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

taskRouter.get('/tasks', auth, async (req: Request, res: Response) => {
    try {
        const populatedUser = await req.user.populate<{ tasks: Array<ITask> }>('tasks', undefined, undefined, { completed: false}, {path: 'tasks', options:{limit: 10, sort:{ description : -1}, }})
        const userInfo = await populatedUser.toJSON()
        res.send(userInfo)
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

export default taskRouter;
