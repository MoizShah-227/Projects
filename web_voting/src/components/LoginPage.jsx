  import React, { useState } from 'react';
  import logo from '../img/logo 1.png';
  import side from '../img/Side Image.svg';
  import './loginpage.css';
  import { useNavigate } from 'react-router-dom';
  import apirequest from '../lib/ApiRequest'; 

  const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
      try {
        const response = await apirequest.post('/login', {
          email,
          password
        });

        localStorage.setItem('user', JSON.stringify({
        email: response.data.user.email,
        cnic: response.data.user.cnic,
        id: response.data.user.id
        }));

        navigate('/');

      } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
      }
    };

    return (
      <div className='login-page'>
        <nav className='nav'>
          <div>
            <img src={logo} alt="logo" />
          </div>
            <h4>VoteChain</h4>
        </nav>

        <div className='login-section'>
          <div className='row'>
            <div className='col-lg-6 col-sm-12 left-side'>
              <img src={side} className='side-img' alt="illustration" />
            </div>

            <div className='col-lg-6 col-sm-12'>
              <div className='form-section'>
                <h1>Login to Exclusive</h1>
                <p>Enter your details below</p>

                <input
                  type="text"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className='btn' onClick={handleLogin}>Login</button>
                <button className='btn' onClick={() => navigate("/register")}>SignUp</button>

                <div>
                  <a href="#" className='forgot'>Forgot password</a>
                  <a href="/">Back to home</a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default LoginPage;
