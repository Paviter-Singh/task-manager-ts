import Task, { ITask } from "../models/task";
import { Router, Response } from "express";
import { userRequest } from "../types/user";
import { auth } from "../middleware/auth";

const taskRouter = Router()

taskRouter.post('/task', auth, async (req: userRequest<{}, {}, ITask>, res: Response) => {
    try {
        const task = new Task({ ...req.body, owner: req.user?._id })
        await task.save();
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

export default taskRouter;
