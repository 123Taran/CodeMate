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
    <div>
      <form
        className="flex flex-col bg-black text-white p-4 rounded"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          className="text-black mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="startTime">Start Time</label>
        <input
          type="datetime-local"
          id="startTime"
          className="text-black mb-2"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <label htmlFor="endTime">End Time</label>
        <input
          type="datetime-local"
          id="endTime"
          className="text-black mb-2"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="text-black mb-2 h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="bg-blue-700 rounded p-2 mt-2">
          Submit
        </button>
      </form>
    </div>
  );
}
