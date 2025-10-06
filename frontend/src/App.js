import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Main from "./components/Main";
import { useState } from "react";

function App() {
  const [show, setShow] = useState("none");
  const [isLoggedIn,setisLoggedIn] = useState(false);
  const [username,setusername] = useState("");
  const [submitshow,setsubmitshow] = useState("hidden");
  return (
    <>
      <Navbar setShow={setShow} username = {username} isLoggedIn = {isLoggedIn} setisLoggedIn = {setisLoggedIn}></Navbar>
      <Login show={show} setShow={setShow}  setusername = {setusername} setisLoggedIn = {setisLoggedIn}></Login>
      <Register show={show} setShow={setShow}></Register>
      <Main  setsubmitshow = {setsubmitshow} submitshow = {submitshow} isLoggedIn = {isLoggedIn}>
        
      </Main>
    </>
  );
}

export default App;