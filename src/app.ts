import express , { Application }from 'express'
import './db/mongoose'
import userRouter from './routers/user'
const app = express()

app.use(express.json())
app.use(userRouter)

module.exports = app

export default app