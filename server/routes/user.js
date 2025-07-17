import express from 'express';
import userAuth from '../middlewares/userauth.js';
import { getUserData } from '../controllers/user.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

export default userRouter;