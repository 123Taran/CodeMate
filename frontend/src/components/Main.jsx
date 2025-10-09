import React, { useState, useRef, useEffect, useCallback} from "react";
import axios from "axios";
import CreateMeeting from "./CreateMeeting";
import { socket } from "./socket";

export default function Main(props) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [sessionKey, setSessionKey] = useState("");
  const [inSession, setInSession] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState([]);

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

  const handleLeave = useCallback(async () => {
  if (!inSession) return;

  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post(
        "http://localhost:5000/api/Session/leaveSession",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    setInSession(false);
    setActiveParticipants([]);
    socket.emit("leaveSession", { sessionKey, username: props.username });
    setSessionKey("");
  } catch (err) {
    console.error("Error leaving session:", err);
  }
}, [inSession, sessionKey, props.username]);


  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("userJoined", (data) => {
      console.log(data.username + " joined the session");
    });

    socket.on("userLeft", (data) => {
      console.log(data.username + " left the session");
    });

    return () => {
      socket.off("connect");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, []);


useEffect(() => {
  if (!props.isLoggedIn && inSession) {

    handleLeave();
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
    socket.emit("leaveSession", { sessionKey, username: props.username });

    setInSession(false);
    setSessionKey("");
  }
}, [props.isLoggedIn, inSession,props.username,sessionKey,handleLeave]);


  const showParticipants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/Session/getParticipantsList",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const participants = res.data.data;

      const activeParticipantsNames = participants
        .filter((p) => p.leftAt === null)
        .map((p) => p.name);

      setActiveParticipants(activeParticipantsNames);

      console.log(activeParticipants);
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  return (
    <div className="flex flex-col m-auto w-full h-screen">
      <div className="bg-gray-800 mt-2 w-full h-24">
        <button
          className="bg-blue-600 hover:bg-blue-700 rounded w-24 mt-4 ml-5 px-4 py-2"
          onClick={() =>
            props.setsubmitshow((prev) =>
              prev === "block" ? "hidden" : "block"
            )
          }
        >
          Create
        </button>
      </div>

      <div className={`${props.submitshow} m-4 absolute top-40 w-80`}>
        <CreateMeeting />
      </div>

      <div
        className={`w-full h-5/6 flex items-center justify-center text-3xl border-black border-2 ${
          props.submitshow === "block" ? "pointer-events-none" : ""
        }`}
      >
        {!inSession && <p>Join A Meeting</p>}

        {inSession && (
          <div className="w-full h-full bg-white rounded-lg shadow-inner p-3 flex flex-wrap gap-3 overflow-auto">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-1/4 h-48 rounded-md border-2 border-gray-300 object-cover"
            ></video>

            {remoteStreams.map((stream, idx) => (
              <video
                key={idx}
                autoPlay
                className="w-1/4 h-48 rounded-md border-2 border-gray-300 object-cover"
              ></video>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-800 w-full h-32">
        {props.isLoggedIn && inSession ? (
          <button
            className="bg-red-600 hover:bg-red-700 rounded w-32 mt-4 ml-5 px-4 py-2"
            onClick={handleLeave}
          >
            Leave Session
          </button>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 rounded w-24 mt-4 ml-5 px-4 py-2"
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
              className="text-black rounded-md px-3 py-1 w-64 ml-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the 6 digit Meeting Pin"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 rounded w-24 mt-4 ml-5 px-4 py-2"
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
