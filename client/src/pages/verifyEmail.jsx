import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  axios.defaults.withCredentials = true;
  const {backendURL, isLoggedIn, userData, getUserData} = useContext(AppContext);
  const navigate = useNavigate();
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

  const onSubmitHandler = async(e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e=>e.value);
      const otp = otpArray.join('');

      const {data} = await axios.post(backendURL + '/api/auth/verify-account', {otp});
      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedIn, userData])

  return(
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from pink-100 to-pink-300">
      <img
         onClick={() => navigate('/')}
        src="/images/logo.png"
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-28 mr-4 cursor-pointer"
      />
      <form className="bg-slate-100 p-8 rounded-lg shadow-lg w-96 text-sm text-center" onSubmit={onSubmitHandler}> 
        <h1 className="text-pink-700 text-3xl font-libre font-semibold">Email Verify OTP</h1>
        <p className="text-pink-400 text-md font-outfit font-semibold mt-6 mb-8">Enter the 6 digit code sent to your email ID.</p>
        <div className="flex justify-between mb-4" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input className="w-12 h-12 bg-pink-700 text-white text-center font-outfit text-xl rounded-md"
            ref={e=>inputRefs.current[index] = e} onInput={(e)=>handleInput(e, index)} onKeyDown={(e)=>handleKeyDown(e, index)} type="text" maxLength='1' key={index} required/>
          ))}
        </div>
        <button className="bg-pink-400 text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 mt-6 cursor-pointer w-full">Verify Email</button>
      </form>
    </div>
  )
}

export default VerifyEmail;