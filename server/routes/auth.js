import express from 'express';
import { isAuthenticated, loginUser, logoutUser, registerUser, resetPassword, sendResetOTP, sendVerificationOTP, verifyEmail } from '../controllers/auth.js';
import userAuth from '../middlewares/userauth.js';

const authRouter = express.Router();

authRouter.post('/registerUser', registerUser);

authRouter.post('/loginUser', loginUser);

authRouter.post('/logoutUser', logoutUser);

authRouter.post('/send-verify-otp', userAuth, sendVerificationOTP);

authRouter.post('/verify-account', userAuth, verifyEmail);

authRouter.get('/is-auth', userAuth, isAuthenticated);

authRouter.post('/send-reset-otp', sendResetOTP);

authRouter.post('/reset-password', resetPassword);

export default authRouter;