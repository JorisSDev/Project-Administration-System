import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ManagerRegisterPage from "./pages/manager/ManagerRegisterPage";
import ManagerLoginPage from "./pages/manager/ManagerLoginPage";
import ManagerHomePage from "./pages/manager/ManagerHomePage";
import ManagerCreateGroupPage from "./pages/manager/ManagerCreateGroupPage";
import MemberJoinPage from "./pages/member/MemberJoinPage";
import MemberLoginPage from "./pages/member/MemberLoginPage";
import MemberHomePage from "./pages/member/MemberHomePage";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <div>
          <h1>Whisper</h1>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/manager/register" element={<ManagerRegisterPage />} />
            <Route path="/manager/login" element={<ManagerLoginPage />} />
            <Route path="/manager/home" element={<ManagerHomePage />} />
            <Route
              path="/manager/create-group"
              element={<ManagerCreateGroupPage />}
            />
            <Route path="/member/join" element={<MemberJoinPage />} />
            <Route path="/member/login" element={<MemberLoginPage />} />
            <Route path="/member/home" element={<MemberHomePage />} />
            {/* Redirects and other routes can be added here */}
          </Routes>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
