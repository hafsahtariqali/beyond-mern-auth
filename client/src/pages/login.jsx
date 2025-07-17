import React, { useContext, useState } from "react";
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {backendURL, setIsLoggedIn, getUserData} = useContext(AppContext);

  const onSubmitHandler = async(e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if(state === 'Sign Up'){
        const {data} = await axios.post(backendURL + '/api/auth/registerUser', 
          {name, email, password});
        
        console.log(data);

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }else{
        const {data} = await axios.post(backendURL + '/api/auth/loginUser', 
          {email, password});

        console.log(data);

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return(
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from pink-100 to-pink-300">
      <img
         onClick={() => navigate('/')}
        src="/images/logo.png"
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-28 mr-4 cursor-pointer"
      />
      <div className="bg-slate-100 p-10 rounded-lg shadow-lg w-full sm:w-96 text-center">
        <h2 className="text-pink-600 text-3xl font-libre font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className="text-pink-400 text-md font-outfit font-semibold mt-2 mb-4">{state === 'Sign Up' ? 'Create your account!' : 'Login to your account!'}</p>

      <form onSubmit={onSubmitHandler}>
        {state === 'Sign Up' && (<div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full   bg-[#D6336C]">
          <UserIcon className="w-5 h-5 text-white mr-2" />
          <input onChange={e => setName(e.target.value)} value={name} className="bg-transparent outline-none placeholder-white" type="text" placeholder="Full Name" required />
        </div>)}
        
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#D6336C]">
           <EnvelopeIcon className="w-5 h-5 text-white mr-2" />
          <input onChange={e => setEmail(e.target.value)} value={email} className="bg-transparent outline-none placeholder-white" type="email" placeholder="Email" required />
        </div>
        <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#D6336C]">
           <LockClosedIcon className="w-5 h-5 text-white mr-2" />
          <input onChange={e => setPassword(e.target.value)} value={password} className="bg-transparent outline-none placeholder-white" type="password" placeholder="Password" required />
        </div>

        <p  onClick={() => navigate('/reset-password')} className="text-pink-400 text-md font-outfit font-semibold mt-2 cursor-pointer">Forgot Password?</p>

        <button className="bg-pink-400 w-full text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 cursor-pointer mt-2">{state}</button>
      </form>

      {state === 'Sign Up' ? (<p className="text-gray-500 text-xs text-center mt-4">Already have an account?{' '}
        <span onClick={()=>setState('Login')} className="text-blue-500 cursor-pointer underline">Login Here</span>
      </p>) 
      : (<p className="text-gray-500 text-xs text-center mt-4">Don't have an account?{' '}
        <span onClick={()=>setState('Sign Up')} className="text-blue-500 cursor-pointer underline">Signup Here</span>
      </p>)}
      </div>
    </div>
  )
}

export default Login;