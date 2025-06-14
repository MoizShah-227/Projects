import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Register from './components/RegisterPage';
import VotingPage from './components/VotingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={< Register/>} />
        <Route path="/vote" element={< VotingPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
