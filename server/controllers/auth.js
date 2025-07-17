import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import transporter from '../config/nodemailer.js';

export const registerUser = async(req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password){
    return res.json({success: false, message: "Missing details."});
  } 
  try {
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.json({success: false, message: "User already exists."});
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword});
    await user.save();

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Beyond Authentication Website',
      text: `Welcome to Beyond Authentication Website. Your account has been created under the email id: ${email}.`
    }

    await transporter.sendMail(mailOptions);

    return res.json({success: true});
  } catch (error) {
      res.json({success: false, message: error.message});
  }
}

export const loginUser = async(req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.json({success: false, message: "Email and password are required."});
  } 
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.json({success: false, message: "Invalid email or password."});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.json({success: false, message: "Invalid password."});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({success: true});
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}

export const logoutUser = async(req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none': 'strict',
    });

    return res.json({success: true, message: "Logged out."});
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}

export const sendVerificationOTP = async(req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if(user.isAccountVerified){
      return res.json({success: false, message: "Account is already verified."});
    }
    
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP : Beyond Authentication Website',
      text: `Welcome to Beyond Authentication Website. Your account verification OTP is ${otp}. Verify your account with this OTP. Do not share this OTP with anyone`
    }

    await transporter.sendMail(mailOptions);

    return res.json({success: true, message: "Account verification OTP sent on email."});
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}

export const verifyEmail = async(req, res) => {
  const {otp} = req.body;
  const userId = req.userId;
  if(!userId || !otp){
    return res.json({success: false, message: "Missing details."});
  }
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.json({success: false, message: "User not found."});
    }

    if(user.verifyOTP==="" || user.verifyOTP !== otp){
      return res.json({success: false, message: "Invalid OTP."});
    }
    if(user.verifyOTPExpireAt < Date.now()){
      return res.json({success: false, message: "OTP expired."});
    }

    user.isAccountVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;

    await user.save();
    return res.json({success: true, message: "Email verified successfully."});
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}

export const isAuthenticated = async(req, res) => {
  try {
    return res.json({success: true});
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}

export const sendResetOTP = async(req, res) => {
  const {email} = req.body;
  if(!email){
    return res.json({success: false, message: "Email is required."});
  }
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.json({success: false, message: "User not found."});
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP : Beyond Authentication Website',
      text: `Welcome to Beyond Authentication Website. Your password reset OTP is ${otp}. Reset you password with this OTP. Do not share this OTP with anyone`
    }

    await transporter.sendMail(mailOptions);

    return res.json({success: true, message: "Password Reset OTP sent on email."});
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}

export const resetPassword = async(req, res) => {
  const {email, otp, newPassword} = req.body;
  if(!email || !otp || !newPassword){
    return res.json({success: false, message: "Email, OTP and New Password are required."});
  }
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.json({success: false, message: "User not found."});
    }
    if(user.resetOTP !== otp || user.resetOTP === ""){
      return res.json({success: false, message: "Invalid OTP."});
    }
    if(user.resetOTPExpireAt < Date.now()){
      return res.json({success: false, message: "OTP has expired."});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;
    await user.save();

    return res.json({success: true, message: "Password has been reset successfully!"});     
  } catch (error) {
      return res.json({success: false, message: error.message});
  }
}