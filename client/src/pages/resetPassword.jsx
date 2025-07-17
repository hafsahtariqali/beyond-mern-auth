import React, { useState, useContext } from "react";
import {EnvelopeIcon, LockClosedIcon} from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const {backendURL} = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputRefs = React.useRef([]);
    const handleInput = (e, index) => {
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index+1].focus();
      }
    }
  
    const handleKeyDown = (e, index) => {
      if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRefs.current[index-1].focus();
      }
    }
  
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text');
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index) => {
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
      });
    }

  const onSuubmitEmail = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendURL + '/api/auth/send-reset-otp', {email});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async(e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e=>e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendURL + '/api/auth/reset-password', {email, otp, newPassword});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return(
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from pink-100 to-pink-300">
      <img
         onClick={() => navigate('/')}
        src="/images/logo.png"
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-28 mr-4 cursor-pointer"
      />
      {!isEmailSent && 
      <form onSubmit={onSuubmitEmail} className="bg-slate-100 p-8 rounded-lg shadow-lg w-96 text-sm text-center"> 
        <h1 className="text-pink-700 text-2xl font-libre font-semibold">Reset Password OTP</h1>
        <p className="text-pink-400 text-md font-outfit font-semibold mt-6 mb-8">Enter your registered email ID.</p>
        <div className="flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-pink-700">
          <EnvelopeIcon className="w-5 h-5 text-white mr-2" />
          <input type="email" className="bg-transparent outline-none placeholder-white text-white" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <button className="bg-pink-400 text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 mt-6 cursor-pointer w-full">Send OTP</button>
      </form>
    }


      {!isOtpSubmitted && isEmailSent && 
      <form onSubmit={onSubmitOtp} className="bg-slate-100 p-8 rounded-lg shadow-lg w-96 text-sm text-center"> 
        <h1 className="text-pink-700 text-2xl font-libre font-semibold">Reset Password OTP</h1>
        <p className="text-pink-400 text-md font-outfit font-semibold mt-6 mb-8">Enter the 6 digit code sent to your email ID.</p>
        <div className="flex justify-between mb-4" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input className="w-12 h-12 bg-pink-700 text-white text-center font-outfit text-xl rounded-md"
            ref={e=>inputRefs.current[index] = e} onInput={(e)=>handleInput(e, index)} onKeyDown={(e)=>handleKeyDown(e, index)} type="text" maxLength='1' key={index} required/>
          ))}
        </div>
        <button className="bg-pink-400 text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 mt-6 cursor-pointer w-full">Reset Password</button>
      </form>
    }

    {isOtpSubmitted && isEmailSent && 
      <form onSubmit={onSubmitNewPassword} className="bg-slate-100 p-8 rounded-lg shadow-lg w-96 text-sm text-center"> 
        <h1 className="text-pink-700 text-2xl font-libre font-semibold">Create New Password</h1>
        <p className="text-pink-400 text-md font-outfit font-semibold mt-6 mb-8">Enter your new password.</p>
        <div className="flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-pink-700">
          <LockClosedIcon className="w-5 h-5 text-white mr-2" />
          <input type="password" className="bg-transparent outline-none placeholder-white text-white" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/>
        </div>
        <button className="bg-pink-400 text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 mt-6 cursor-pointer w-full">Set Password</button>
      </form>
      }
    </div>
  )
}

export default ResetPassword;