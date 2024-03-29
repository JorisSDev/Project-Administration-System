import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MemberJoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/group", {
      method: "GET",
      headers: {
        Token: searchParams.get("token"),
      },
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        setError("Access to group denied");
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => setEmail(body.email));
      }
    });
  }, []);

  const handleJoin = () => {
    fetch("/api/join", {
      method: "POST",
      body: JSON.stringify({ nickname, password }),
      headers: {
        "Content-Type": "application/json",
        Token: searchParams.get("token"),
      },
    }).then((res) => {
      if (res.status === 401) {
        setError("Access to group denied--");
        return;
      }
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
      <h2>Join group by {email}</h2>
      <div>Please provide these details:</div>
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
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
};

export default MemberJoinPage;
