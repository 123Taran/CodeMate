import React, { useState } from "react";
import axios from "axios";

export default function CreateMeeting() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/Session/createSession",
        {
          Title: title,
          startTime,
          endTime,
          Description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Meeting created successfully!");
      setTitle("");
      setStartTime("");
      setEndTime("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Error creating meeting. Make sure you are logged in as a TA.");
    }
  };

  return (
    <div className="p-4">
      <form
        className="flex flex-col bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Meeting</h2>
        <label htmlFor="title" className="mb-1 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="text-black rounded-md px-3 py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="startTime" className="mb-1 font-medium">
          Start Time
        </label>
        <input
          type="datetime-local"
          id="startTime"
          className="text-black rounded-md px-3 py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <label htmlFor="endTime" className="mb-1 font-medium">
          End Time
        </label>
        <input
          type="datetime-local"
          id="endTime"
          className="text-black rounded-md px-3 py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <label htmlFor="description" className="mb-1 font-medium">
          Description
        </label>
        <textarea
          id="description"
          className="text-black rounded-md px-3 py-2 mb-4 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white rounded-md py-2 mt-2 font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
