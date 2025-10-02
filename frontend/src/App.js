import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Login from "./components/Login"
import { useState } from "react";

function App() {

  const [show,setShow] = useState("none");
  return (
    <>
      <Navbar setShow = {setShow}></Navbar>
      <Login show = {show} setShow = {setShow}></Login>
      <Register show = {show} setShow = {setShow}></Register>
    </>
  );
}

export default App;
