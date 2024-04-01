import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../types/env";
import { Types } from "mongoose";
import User from "../models/user";

interface jwtPayload extends jwt.JwtPayload {
  _id: Types.ObjectId;
}

async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Not Authorize");
    }
    var decoded = <jwtPayload>jwt.verify(token, config.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("Not Authorize");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
}
export { auth };
