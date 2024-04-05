import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import QRCode from "react-qr-code";

const ManagerCreateGroupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("/api/create-group", {
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
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      fetch("/api/group", {
        method: "GET",
        headers: {
          Token: token,
        },
      }).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          res.json().then((body) => setMembers(body.members));
        }
      });
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <div>
      <h2>New group by {email}</h2>
      <div>Please scan the QR code to join:</div>
      <div>
        <QRCode value={`https://localhost:9000/member/join?token=${token}`} />
      </div>
      <div>{token}</div>
      <div>Members that joined:</div>
      <ul>
        {members.map((member) => (
          <li>{member}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/manager/home")}>Done</button>
    </div>
  );
};

export default ManagerCreateGroupPage;
