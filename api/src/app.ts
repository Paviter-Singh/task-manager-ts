import express , { Application }from 'express'
import './db/mongoose'
import userRouter from './routers/user'
import taskRouter from './routers/task'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import config from './types/env'
const app = express()
app.use(express.json())
app.use(cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true
}))
app.use(cookieParser())

app.use(userRouter)
app.use(taskRouter)

export default app