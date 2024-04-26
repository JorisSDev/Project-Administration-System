import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/me", {
      method: "GET",
    }).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => {
          if (body.email) {
            navigate("/manager/home");
          } else {
            navigate("/member/home");
          }
        });
      }
    });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome to PAS - Project Administration System</h2>
      <p className="text-center mb-5">Select an option to get started managing your projects efficiently.</p>
      <div className="d-grid gap-2 col-6 mx-auto">
        <button
          className="btn btn-primary mb-2"
          onClick={() => navigate("/user/register")}
        >
          Register as Manager
        </button>
        <button
          className="btn btn-secondary mb-2"
          onClick={() => navigate("/user/login")}
        >
          Login as Manager
        </button>
      </div>
    </div>
  );
};

export default HomePage;
