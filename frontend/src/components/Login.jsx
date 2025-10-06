import React, { useState } from "react";
import axios from "axios";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);
      setSuccess("Login successful!");

      props.setisLoggedIn(true);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.name);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("inSession", response.data.user.inSession);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div
        className={`${
          props.show !== "Login" ? "hidden" : "absolute"
        } bg-black text-white w-min border right-4 p-4`}
      >
        <p className="inline text-2xl text-bold">Login</p>

        <button
          className="relative left-40 text-3xl"
          onClick={() => props.setShow("none")}
        >
          &#10005;
        </button>

        <form onSubmit={handleLogin} className="flex flex-col mt-2">
          <label htmlFor="email">Email Id</label>
          <input
            className="bg-gray-500 w-64 mb-5"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            className="bg-gray-500 w-64 mb-5"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="w-24 bg-blue-700 m-auto">
            Submit
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>

        <button
          className="text-blue-500 mt-5"
          onClick={() => props.setShow("register")}
        >
          Don't have an account? Click here!
        </button>
      </div>
    </>
  );
}

export default Login;