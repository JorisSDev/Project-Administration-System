import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManagerHomePage = () => {
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
    <div>
      <h2>Home</h2>
      <div>
        <button onClick={() => navigate("/manager/register")}>
          Register as manager
        </button>
      </div>
      <div>
        <button onClick={() => navigate("/manager/login")}>
          Login as manager
        </button>
      </div>
      <div>
        <button onClick={() => navigate("/member/login")}>
          Login as member
        </button>
      </div>
    </div>
  );
};

export default ManagerHomePage;
