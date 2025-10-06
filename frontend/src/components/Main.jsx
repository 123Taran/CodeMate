import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import CreateMeeting from "./CreateMeeting";
import { socket } from "./socket";

export default function Main(props) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [sessionKey, setSessionKey] = useState("");
  const [inSession, setInSession] = useState(false);

  const localVideoRef = useRef();
  const [remoteStreams, setRemoteStreams] = useState([]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/Session/joinSession",
        { sessionKey: Number(sessionKey) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInSession(true);
      setShowJoinForm(false);

      socket.emit("joinSession", { sessionKey, username: props.username });

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    } catch (err) {
      alert("Error joining session");
    }
  };

  const handleLeave = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/Session/leaveSession",
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setInSession(false);
      socket.emit("leaveSession", { sessionKey, username: props.username });
      setSessionKey("");
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }
    } catch (err) {
      console.log("Error leaving session:", err);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("userJoined", (data) => {
      console.log(data.username + " joined the session");    });

    socket.on("userLeft", (data) => {
      console.log(data.username + " left the session");
    });

    return () => {
      socket.off("connect");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, []);

  return (
    <div className="flex flex-col m-auto w-8/12 h-screen">
      {/* Top bar */}
      <div className="bg-black mt-2 w-full h-24">
        <button
          className="bg-blue-700 rounded w-24 mt-4 ml-5"
          onClick={() =>
            props.setsubmitshow((prev) =>
              prev === "block" ? "hidden" : "block"
            )
          }
        >
          Create
        </button>
      </div>

      <div
        className={`${props.submitshow} border-black border-solid border-4 rounded-2xl m-4 absolute top-36 w-64`}
      >
        <CreateMeeting />
      </div>

      <div
  className={`w-full h-5/6 flex items-center justify-center text-3xl border-black border-2 ${
    props.submitshow === "block" ? "pointer-events-none" : ""
  }`}
>

        {!inSession && <p>Join A Meeting</p>}

        {inSession && (
          <div className="w-full h-full flex flex-wrap gap-2">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-1/3 border"
            ></video>

            {remoteStreams.map((stream, idx) => (
              <video
                key={idx}
                autoPlay
                className="w-1/3 border"
              ></video>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-black w-full h-24">
        {props.isLoggedIn && inSession ? (
          <button
            className="bg-red-700 rounded w-32 mt-4 ml-5"
            onClick={handleLeave}
          >
            Leave Session
          </button>
        ) : (
          <button
            className="bg-blue-700 rounded w-24 mt-4 ml-5"
            onClick={() => setShowJoinForm((prev) => !prev)}
          >
            Join
          </button>
        )}

        {showJoinForm && !inSession && (
          <div>
            <input
              type="number"
              min={100000}
              max={999999}
              value={sessionKey}
              onChange={(e) => setSessionKey(e.target.value)}
              className="ml-5 w-56 border-2 border-black rounded-md"
              placeholder="Enter the 6 digit Meeting Pin"
            />
            <button
              className="bg-blue-700 rounded w-24 mt-4 ml-5"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}