import React, { useState } from "react";
import axios from "axios";

export default function Register({ show, setShow }) {
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
        { name, email, password, role }
      );

      setSuccess("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("Teaching Assistant");
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error(err.response?.data);
    }
  };

  if (show !== "register") return null;

  return (
    <div className="absolute right-4 top-36 bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Register</h2>
        <button
          className="text-2xl hover:text-red-500 transition"
          onClick={() => setShow("none")}
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block mb-1 text-gray-300">
            Choose a Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Teaching Assistant">Teaching Assistant</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded text-white font-medium"
        >
          Submit
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
      </form>
    </div>
  );
}
