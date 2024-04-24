import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import multer from 'multer';
import {
  postLoginBody,
  postUserBody,
  userJSON,
  UserRequest,
} from "../types/user";
import { auth } from "../middleware/auth";
import { ObjectId } from "mongoose";
const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(null, true)
  }
})

router.post(
  "/user",
  async (
    req: Omit<Request<{}, {}, postUserBody>, 'token' | 'user'>,
    res: Response,
    next: NextFunction
  ) => {
    const user = new User(req.body);
    try {
      await user.save();

      const token = await user.generateAuthToken();
      const userInfo: userJSON = await user.toJSON();
      res.cookie('user', token)
      res.status(201).send({ user: userInfo, token });
    } catch (e: any) {
      if (e.code === 11000) {
        return res.status(400).send("email exists");
      }
      res.status(400).send(e);
    }
  }
);

router.post(
  "/users/login",
  async (
    req: Omit<Request<{}, {}, postLoginBody>, keyof UserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      const userInfo = await user.toJSON();
      res.cookie('user', token, {
        // expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,
      })
      res.send({ user: userInfo, token });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.post(
  "/user/logout",
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    try { 
      req.user.tokens = req.user.tokens.filter((token) => token !== token);
      req.user.save();
      res.clearCookie('user')
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

router.post(
  "/user/logout",
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user.tokens = [];
      req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

router.get('/users/curr', auth, async (req: Request, res: Response) => {
  const user = await req.user?.toJSON()
  res.send(user)
})

router.patch('/users/curr', auth, async (req: Request<{}, {}, postUserBody>, res: Response) => {
  try {

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
router.delete('/users/curr', auth, async (req: Request<{}, {}, postUserBody>, res: Response) => {
  try {
    await User.findOneAndDelete({ _id: req.user._id })
    res.send(req.user)
  }
  catch (e) {
    res.status(400).send(e)
  }
})
router.post('/users/curr/avatar', auth, upload.single('avatar'), async (req: Request<{}, {}, postUserBody>, res: Response) => {
  try {
    if (!req.file) {
      throw new Error("Server Error")
    }
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send(req.file.filename)
  }
  catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/users/curr/avatar', auth, async (req: Request, res: Response) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
  }
  catch (e) {
    res.status(500).send()
  }
})

router.get('/users/:id/avatar', async (req: Omit<Request<{ id: ObjectId }>, keyof UserRequest>, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(400).send()
  }
})
router.get('/users/avatar', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  }
  catch (e) {
    res.status(400).send()
  }
})

export default router;
