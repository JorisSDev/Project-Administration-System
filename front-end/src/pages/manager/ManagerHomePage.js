import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManagerHomePage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/me", {
      method: "GET",
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        navigate("/manager/register");
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => setEmail(body.email));
      }
    });
  }, []);

  return (
    <div>
      <h2>Manager home</h2>
      <div>You are logged in as: {email}</div>
      <div>
        <button onClick={() => navigate("/manager/create-group")}>
          Create group
        </button>
      </div>
    </div>
  );
};

export default ManagerHomePage;
