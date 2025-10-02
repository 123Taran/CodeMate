import React, { useState } from "react";
import axios from "axios";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teaching Assistant"); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register", 
        {
          name,
          email,
          password,
          role,
        }
      );
      console.log(response.data);
      setSuccess("Registration successful!");
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <div
        className={`${
          props.show !== "register" ? "hidden" : "absolute"
        } bg-gray-900 text-white w-min border right-0`}
      >
        <button
          className="relative left-56 text-3xl"
          onClick={() => props.setShow("none")}
        >
          &#10005;
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            className="bg-gray-500 w-64 mb-5"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <label htmlFor="role">Choose a Role:</label>
          <select
            name="role"
            id="role"
            className="w-64 mb-5 bg-gray-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Teaching Assistant">Teaching Assistant</option>
            <option value="Student">Student</option>
          </select>

          <button type="submit" className="w-24 bg-blue-700 m-auto">
            Submit
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </div>
    </>
  );
}

export default Register;
