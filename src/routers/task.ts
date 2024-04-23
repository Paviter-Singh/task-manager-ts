import Task, { ITask } from "../models/task";
import { Router, Response, Request } from "express";
import { auth } from "../middleware/auth";

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
        const populatedUser = await req.user.populate<{ tasks: Array<ITask> }>('tasks', undefined, undefined, {} , {path: 'tasks', options:{limit: 10, sort:{ description : -1}, }})
        const userInfo = await populatedUser.toJSON()
        res.send(userInfo)
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

const objectKeys = <Obj>(obj: Obj & {}):(keyof Obj)[] =>{
    return Object.keys(obj) as (keyof Obj)[]
}
taskRouter.patch('/tasks/:id', auth, async (req: Request<{id: string}, {} , ITask >, res) => {
    let input = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = input.every((update) => allowedUpdates.includes(update))
    const updates = objectKeys<ITask>(req.body)

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    let obj1 = {a: '', b: ''}
    let obj2 = {a: '1', b: '2', c: '3'}
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => { 

            task[update] = req.body[update] as never
                
        })
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send({error: err})
    }
})

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


export default taskRouter;
