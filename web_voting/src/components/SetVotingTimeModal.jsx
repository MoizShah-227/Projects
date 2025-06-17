// components/SetVotingTimeModal.jsx
import React, { useState } from 'react';
import './AddCandidateModal.css'; // reuse styling

const SetVotingTimeModal = ({ show, onHide, onSubmit }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = () => {
    const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
    const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
    onSubmit(startUnix, endUnix);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Voting Time</h2>
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label>End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onHide}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Set Time</button>
        </div>
      </div>
    </div>
  );
};

export default SetVotingTimeModal;
