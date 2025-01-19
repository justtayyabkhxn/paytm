import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
           <Route path="/sign-in" element={<SignIn />} />
          {/*<Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />{" "} */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
