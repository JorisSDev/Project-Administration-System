import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ManagerRegisterPage from "./pages/manager/ManagerRegisterPage";
import ManagerHomePage from "./pages/manager/ManagerHomePage";
import ManagerCreateGroupPage from "./pages/manager/ManagerCreateGroupPage";
import MemberJoinPage from "./pages/member/MemberJoinPage";
import MemberHomePage from "./pages/member/MemberHomePage";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <div>
          <h1>Whisper</h1>
          <Routes>
            <Route
              path="/"
              element={<Navigate replace to="/manager/register" />}
            />
            <Route path="/manager/register" element={<ManagerRegisterPage />} />
            <Route path="/manager/home" element={<ManagerHomePage />} />
            <Route
              path="/manager/create-group"
              element={<ManagerCreateGroupPage />}
            />
            <Route path="/member/join" element={<MemberJoinPage />} />
            <Route path="/member/home" element={<MemberHomePage />} />
            {/* Redirects and other routes can be added here */}
          </Routes>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
