import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MemberLoginPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ nickname, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        res.json().then((body) => setError(body.message));
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        navigate("/member/home");
        return;
      }
    });
  };

  return (
    <div>
      <h2>Member login</h2>
      <div>Nickname:</div>
      <input
        type="text"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
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

export default MemberLoginPage;
