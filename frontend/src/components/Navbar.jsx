import React, { useState, useEffect } from "react";

export default function Navbar(props) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (props.isLoggedIn) {
      setUsername(localStorage.getItem("username") || "");
    } else {
      setUsername("");
    }
  }, [props.isLoggedIn]);

  const handleClick = () => {
    if (props.isLoggedIn) {
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("inSession");
      props.setisLoggedIn(false);
    } else {
      props.setShow("Login");
    }
  };

  return (
    <div className="bg-gray-900 text-white shadow-md">
      <h1 className="text-3xl font-bold pt-2 pl-4">CodeMate</h1>
      <div className="flex justify-between">
        <ul className="flex h-16">
          <li className="m-5">
            <a href="/" className="hover:text-blue-500 transition-colors">
              Home
            </a>
          </li>
          <li className="m-5">
            <a href="/" className="hover:text-blue-500 transition-colors">
              About
            </a>
          </li>
          <li className="m-5">
            <a href="/" className="hover:text-blue-500 transition-colors">
              Contact
            </a>
          </li>
        </ul>

        <div className="mr-5 mt-2 flex gap-3 p-2">
          <p
            className={`transition-opacity duration-300 ${
              props.isLoggedIn ? "opacity-100 block" : "opacity-0 hidden"
            } text-gray-300 text-sm md:text-base`}
          >
            {username && `Welcome, ${username}`}
          </p>

          <button
            className="bg-blue-700 hover:bg-blue-800 rounded w-32 mt-0 ml-5 px-4 py-2"
            onClick={handleClick}
          >
            {props.isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
