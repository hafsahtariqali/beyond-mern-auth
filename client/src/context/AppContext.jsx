import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendURL = import.meta.env.VITE_BACKENDURL || "http://localhost:4000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async() => {
    try {
      const {data} = await axios.get(backendURL + '/api/auth/is-auth');
      if(data.success){
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getUserData = async() => {
    try {
      const {data} = await axios.get(backendURL + '/api/user/data');
      if(data.success){
        setUserData(data.userData);
      }
      else{
        setUserData(null);
        toast.error(data.message || "Failed to get user");
      }
    } catch (error) {
      setUserData(null);
      toast.error(error.response?.data?.message || "Error getting user");
    }
  }

  useEffect(()=>{
    getAuthState();
  }, [])

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  }

  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}