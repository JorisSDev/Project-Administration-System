import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MemberHomePage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

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
      <h2>Member home</h2>
      <div>You are logged in as: {nickname}</div>
    </div>
  );
};

export default MemberHomePage;
