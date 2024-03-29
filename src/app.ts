import express , { Application }from 'express'
import './db/mongoose'
import Task from './models/task';
const app = express()

app.use(express.json())
run().catch(err => console.log(err));

async function run() {
  // 4. Connect to MongoDB

  const task = new Task({
    description: "to list all the test cases",
    completed: false
  });
  await task.save();

  console.log(task.description); // 'bill@initech.com'
}
module.exports = app

export default app