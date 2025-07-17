import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const {userData} = useContext(AppContext);
  console.log("userData:", userData);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-pink-50">
      <img
        src="/images/headerimage.png"
        alt="Logo"
        className="w-28 sm:w-42 mb-6"
      />
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-pink-700 text-4xl font-libre font-semibold">Hey {userData ? userData.name : 'Developer'}!</h1>
        <img
          src="/images/heart.png"
          alt="Heart"
          className="w-20 h-20"
        />
      </div>
      <h2 className="text-pink-600 text-xl font-libre font-semibold">Welcome to our app!</h2>
      <p className="text-pink-400 text-lg font-outfit font-semibold mt-6">Let's start with a quick product tour and we will have you up and running in no time!</p>
      <button className="bg-pink-400 text-white px-6 py-2 rounded-full font-outfit hover:bg-pink-800 transition duration-300 mt-6 cursor-pointer">
        Get Started &rarr;
      </button>
    </div>
  );
};

export default Header;
