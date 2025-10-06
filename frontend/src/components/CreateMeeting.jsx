import React from "react";
import { useState } from "react";
import axios from "axios";

export default function CreateMeeting() {
  const [title, settitle] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [description, setdescription] = useState("");
  const handleSubmit = async(e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if(!token){
      alert("You need to log in First");
      return;
    }

    await axios.post(
  "http://localhost:5000/api/session/createSession",
  {
    title,
    startTime,
    endTime,
    description,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }


);

  };
  return (
    <div>
      <form className="flex flex-col bg-black text-white" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" className="text-black" value={title} onChange={(e) => settitle(e.target.value)}  required/>

        <label htmlFor="startTime">StartTime</label>
        <input type="datetime-local" className="text-black" id="startTime" onChange={(e) => setstartTime(e.target.value)} required/>

        <label htmlFor="endTime">EndTime</label>
        <input type="datetime-local" className="text-black" id="dateTime" onChange={(e) => setendTime(e.target.value)} required/>

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
        className = "h-28 text-black"
          id="description"
          onChange={(e) => setdescription(e.target.value)}
          value={description}
        ></textarea>

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}