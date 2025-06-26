import React, { useState } from 'react';
import './AddCandidateModal.css'; // reuse styling

const SetVotingTimeModal = ({ show, onHide, onSubmit }) => {
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = () => {
    if (!electionName || !startTime || !endTime) {
      alert("Please fill all fields including election name.");
      return;
    }

    const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
    const endUnix = Math.floor(new Date(endTime).getTime() / 1000);

    if (startUnix >= endUnix) {
      alert("Start time must be before end time.");
      return;
    }

    onSubmit(startUnix, endUnix, electionName);
    setElectionName('');
    setStartTime('');
    setEndTime('');
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Voting Time</h2>

        <label>Election Name</label>
        <input
          type="text"
          placeholder="e.g. General Elections 2025"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
        />

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
