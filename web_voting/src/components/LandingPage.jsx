import React, { useEffect, useState } from 'react';
import "./landingpage.css";
import logo from "../img/logo 1.png";
import hero from "../img/hero.svg";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setIsLoggedIn(true);
  }, []);

  const handleEvent = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/vote');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='landing-page container'>
      <nav className='nav-bar'>
        <div className='logo'>
          <img src={logo} alt="#" />
          <h3>VoteChain</h3>
        </div>
        <div>
          <button
            className='btn login-btn'
            onClick={() => navigate('/login')}
            disabled={isLoggedIn}
            style={{ opacity: isLoggedIn ? 0.5 : 1, cursor: isLoggedIn ? 'not-allowed' : 'pointer' }}
          >
            Login
          </button>
        </div>
      </nav>

      <div className='contain-hero'>
        <div className="row container">
          <div className="col-lg-6 col-sm-12">
            <h1>Secure, Transparent, and<br />
              Tamper-Proof Voting with <br />
              Blockchain</h1>
            <p>Traditional voting systems often suffer from issues like tampering,
              double voting, and lack of transparency. With blockchain-powered
              voting, every vote is securely recorded, immutable, and verifiable
              in real time.</p>
            <button className='btn voting-btn' onClick={handleEvent}>Vote</button>
          </div>
          <div className="col-lg-6 col-sm-12">
            <img src={hero} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
