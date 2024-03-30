import { Schema, model, connect } from "mongoose";
import env from "../types/env";
console.log("mongoose is called ");
try {
  connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: "task-manager",
  })
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => console.log(error));
} catch (err) {
  console.log(err);
}
