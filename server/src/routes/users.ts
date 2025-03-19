import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import cookieParser from "cookie-parser";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/user';
dotenv.config();

const router = Router();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET as string;

router.use(cookieParser());

interface CustomJwtPayload extends JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// add a new user
router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// login a user
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const isExistingUser = await UserModel.findOne({ email });

    if (!isExistingUser) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const passOk = bcrypt.compareSync(password, isExistingUser.password);

    if (!passOk) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const payload = {
      id: isExistingUser._id,
      firstName: isExistingUser.firstName,
      lastName: isExistingUser.lastName,
      email: isExistingUser.email,
      message: "LoginTrue",
    };

    const token = jwt.sign(payload, secret, {});
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' }).json(payload);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// check if user is logged in
router.get('/is-logged-in', async (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;
    res.json(decoded);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// get user profile
router.get('/profile', async (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// logout a user
router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

export default router;