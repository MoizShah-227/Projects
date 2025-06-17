// components/AddCandidateModal.jsx
import React, { useState } from 'react';
import './AddCandidateModal.css'; // We'll create this CSS next

const AddCandidateModal = ({ show, onHide, onSubmit }) => {
  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');

  const handleSubmit = () => {
    onSubmit(name, slogan);
    setName('');
    setSlogan('');
    onHide(); // Close modal after submission
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Candidate</h2>

        <label>Candidate Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Candidate Slogan</label>
        <input
          type="text"
          placeholder="Enter slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onHide}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Add Candidate</button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
