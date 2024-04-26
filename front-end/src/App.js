import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import HomePage from "./pages/HomePage";
import UserRegisterPage from "./pages/user/RegisterPage.js";
import UserLoginPage from "./pages/user/LoginPage.js";
import UserHomePage from "./pages/user/UserHomePage.js";
import ProjectCreatePage from "./pages/user/ProjectCreatePage.js";
import ProjectPage from "./pages/user/ProjectPage.js";
import logo from './logo.png'; 
import Header2 from "./Header.js";
import AboutUsPage from "./pages/AboutUsPage.js";
import TaskCreatePage from "./pages/user/TaskCreatePage.js";
import StatisticsPage from "./pages/user/StatisticsPage.js";

function Header1() {
  return (
    <div className="container-fluid bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-1 col-sm-4 d-flex align-items-center justify-content-start">
            <img src={logo} style={{width: '75px'}} />
          </div>
          <div className="col-md-8 col-sm-8 d-flex flex-wrap align-items-center justify-content-start">
            <h2>Project Administration System</h2>
          </div>
        </div> 
      </div>
    </div>
  );
}


function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <div>
          <Header2 />
          <br/>
            <Routes>
              {/* /user pages requires login or are login/register */}
              <Route path="/" element={<Navigate replace to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage/>} />
              <Route path="/user" element={<Navigate replace to="/main" />} />
              <Route path="/user/home" element={<UserHomePage/>} />
              <Route path="/user/register" element={<UserRegisterPage />} />
              <Route path="/user/login" element={<UserLoginPage />} />
              <Route path="/user/create-project" element={<ProjectCreatePage />} />
              <Route path="/user/project/:projectId" element={<ProjectPage />} />
              <Route path="/user/project/:projectId/create-task" element={<TaskCreatePage />} />
              <Route path="/user/statistics" element={<StatisticsPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
