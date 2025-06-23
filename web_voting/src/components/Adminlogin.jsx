import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminlogin.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if(username === "Admin" && password === "123") {
        navigate('/admin');
      } else {
        setError("Invalid Credentials!!");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <h3 className="text-center">Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Login
          </button>
          <a href="/">back to Home</a>
          
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login; 