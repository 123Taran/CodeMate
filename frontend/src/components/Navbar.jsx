import React from "react";

export default function Navbar(props) {
  return (
    <div className="bg-black text-white">
      <h1 className="text-2xl font-bold m-auto">
        CodeMate A Collaborative Web Application
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

        <div className="mr-5 mt-5">
          <button onClick={() => {props.setShow("Login")}}>Login</button>
        </div>
      </div>
    </div>
  );
}
