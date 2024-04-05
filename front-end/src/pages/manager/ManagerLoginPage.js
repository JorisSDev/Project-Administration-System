import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManagerLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        res.json().then((body) => setError(body.message));
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        navigate("/manager/home");
        return;
      }
    });
  };

  return (
    <div>
      <h2>Manager login</h2>
      <div>Email:</div>
      <input
        type="text"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <div>Password:</div>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div>{error ? error : ""}</div>
      <div>
        <button onClick={handleRegister}>Login</button>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
