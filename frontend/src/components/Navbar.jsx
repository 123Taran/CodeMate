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
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("inSession");
      props.setisLoggedIn(false);
    } else {
      props.setShow("Login");
    }
  };

  return (
    <div className="bg-black text-white">
      <h1 className="text-3xl font-bold pt-2 pl-4">
        CodeMate 
      </h1>
      <div className="flex justify-between">
        <ul className="flex h-16">
          <li className="m-5">
            <a href="/">Home</a>
          </li>
          <li className="m-5">
            <a href="/">About</a>
          </li>
          <li className="m-5">
            <a href="/">Contact</a>
          </li>
        </ul>

        <div className="mr-5 mt-2 flex gap-3 p-2">
          <p className={props.isLoggedIn ? "block" : "hidden"}>
            {username ? `Welcome, ${username}` : ""}
          </p>
          <button
            className="m-3 border-white border-2 rounded mt-0 pl-4 pr-4"
            onClick={handleClick}
          >
            {props.isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}