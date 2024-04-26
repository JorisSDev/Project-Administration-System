import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "../../Header";

const LoginPage = () => {
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
        navigate("/user/home");
        return;
      }
    });
  };

  return (
    <div className="container p-4">
      <h2 className="mb-3">Manager Login</h2>
      <div className="mb-2">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="text"
          id="email"
          className="form-control"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="password" className="form-label">Password:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="text-danger mb-3">{error}</div>
      <div>
        <button className="btn btn-primary" onClick={handleRegister}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
