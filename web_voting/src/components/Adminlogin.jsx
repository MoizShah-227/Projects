import React, { useState } from 'react';
import apiRequest from '../lib/ApiRequest.js';
import { Navigate, useNavigate } from 'react-router-dom';
import './adminlogin.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add login logic here
    try {
      if(username=="Admin"&&password=="123"){
          navigate('/admin');
        }
      
    } catch (err) {
        setError("Invalid Credentials!!");
    }

  };

  
  

  return (
    <div className="admin-login d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow login-card" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
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

          <div className="mb-3">
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
          <button type="submit" className="login-btn btn w-100">
            Login
          </button>
          <p className='error'>{error}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
