import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MemberLeaveFeedback = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleLeave = () => {
    fetch("/api/leave-feedback", {
      method: "POST",
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        navigate("/manager/register");
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => {
          setEmail(body.email);
          setToken(body.token);
        });
      }
    });
  };

  useEffect(() => {
    fetch("/api/me", {
      method: "GET",
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        navigate("/member/login");
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => setNickname(body.nickname));
      }
    });
  }, []);

  return (
    <div>
      <h2>Feedback by {nickname}</h2>
      <div>
        <textarea
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
      </div>
      <div>
        <button onClick={handleLeave}>Leave</button>
      </div>
    </div>
  );
};

export default MemberLeaveFeedback;
