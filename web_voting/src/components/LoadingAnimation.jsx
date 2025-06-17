import React from 'react';
import './LoadingAnimation.css'; // CSS file you provided

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader"></div>
      <p>Logging you in...</p>
    </div>
  );
};

export default Loader;