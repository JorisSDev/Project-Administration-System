import React, { useState, useEffect } from "react";
import { useNavigate , NavLink} from 'react-router-dom';
import logo from './logo.png'; 


function Header2() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    fetch("/api/logout", { method: "POST" })
      .then(() => {
        setIsAuthenticated(false);
        navigate("/home");
      })
      .catch(error => console.error('Error:', error));
  };

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <NavLink to="/user/home" className="navbar-brand">
        <img src={logo} alt="Logo" style={{ width: '75px' }} />
    </NavLink>
    <button className="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false"
            aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
        <NavLink to="/user/home" className="nav-item nav-link" activeClassName="active">Home</NavLink>
        {!email && <NavLink to="/user/login" className="nav-item nav-link" activeClassName="active">Login</NavLink>}
        {!email && <NavLink to="/user/register" className="nav-item nav-link" activeClassName="active">Register</NavLink>}
        {email && <NavLink to="/user/statistics" className="nav-item nav-link" activeClassName="active">Statistics</NavLink>}
        <NavLink to="/about" className="nav-item nav-link" activeClassName="active">About Us</NavLink>
        </div>
        {email && (
        <div className="ms-auto d-flex align-items-center">
            <span className="navbar-text me-3">Logged in as {email}</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
        )}
    </div>
    </nav>
  );
}

export default Header2;
