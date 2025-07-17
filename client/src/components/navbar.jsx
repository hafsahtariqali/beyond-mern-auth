import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const {userData, backendURL, setUserData, setIsLoggedIn} = useContext(AppContext);

  const sendVerificationOTP = async() => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendURL + '/api/auth/send-verify-otp');
      if(data.success){
        navigate('/verify-account');
        toast.success(data.message);
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const logout = async() => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendURL + '/api/auth/logoutUser');
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src="/images/logo.png"
        alt="Logo"
        className="w-28 sm:w-28 mr-4"
      />
      {userData ? <div className="flex justify-center items-center w-8 h-8 rounded-full bg-pink-400 text-white relative group">
        {userData.name[0].toUpperCase()}
        <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
          <ul className="list-none m-0 p-2 bg-gray-100 text-xsm font-outfit whitespace-nowrap">
            {!userData.isAccountVerified &&  <li onClick={sendVerificationOTP} className="py-1 px-4 hover:bg-gray-200 cursor-pointer">Verify Email</li>}
            <li onClick={logout} className="py-1 px-4 hover:bg-gray-200 cursor-pointer">Log Out</li>
          </ul>
        </div>
      </div> : <button onClick={() => navigate('/login')}
      className="bg-pink-400 text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 cursor-pointer">
        Login &rarr;
      </button> }
      
    </div>
  );
};

export default NavBar;
