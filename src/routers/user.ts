import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import {
  postLoginBody,
  postUserBody,
  userJSON,
  userRequest,
} from "../types/user";
import { auth } from "../middleware/auth";
const router = express.Router();

router.post(
  "/user",
  async (
    req: Request<{}, {}, postUserBody>,
    res: Response,
    next: NextFunction
  ) => {
    const user = new User(req.body);
    try {
      await user.save();

      const token = await user.generateAuthToken();
      const userInfo: userJSON = await user.toJSON();

      res.status(201).send({ user: userInfo, token });
    } catch (e: any) {
      if (e.code === 11000) {
        return res.status(400).send("email exist");
      }
      res.status(400).send(e);
    }
  }
);

router.post(
  "/users/login",
  async (
    req: Request<{}, {}, postLoginBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      const userInfo = await user.toJSON();
      res.send({ user: userInfo, token });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.post(
  "/user/logout",
  auth,
  (req: userRequest, res: Response, next: NextFunction) => {
    console.log("logout is still acalled ");
    try {
      if (!req.user || !req.token) {
        throw new Error("No User Found");
      }
      req.user.tokens = req.user.tokens.filter((token) => token !== token);
      req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

router.post(
  "/user/logout",
  auth,
  (req: userRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error("Noe user Found");
      }
      req.user.tokens = [];
      req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

router.get('/users/curr', auth, async (req: userRequest, res: Response) => {
  const user = await req.user?.toJSON()
  res.send(user)
})

router.patch('/users/curr', auth, async (req: userRequest<{}, {}, postUserBody>, res: Response) => {
  try {
    if (!req.user) {
      throw new Error("user Not found");
    }

    const keys: (keyof postUserBody)[] = ['age', 'email', 'password', 'name']

    keys.forEach(key => {
      if (!req.user || !req.body[key] || !req.user[key]) {
        return;
      }
      (req.user[key] as string | number) = req.body[key];
    })

    await req.user.save()
    const user = await req.user.toJSON()
    res.send(user)
  }
  catch (e) {
    res.status(400).send(e)
  }
})
export default router;
