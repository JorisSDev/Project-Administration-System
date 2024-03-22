import React, { useState } from "react";

const ManagerRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = () => {
    fetch("http://localhost:3000/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => console.log(res));
  };
  return (
    <div>
      <h2>Manager registration</h2>
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
      <div>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default ManagerRegistration;
