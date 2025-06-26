import React, { useState } from 'react';
import './AddCandidateModal.css';

const AddCandidateModal = ({ show, onHide, onSubmit }) => {
  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = () => {
    if (!name || !slogan || !gender) {
      alert("Please fill in all fields including gender.");
      return;
    }

    onSubmit(name, slogan, gender);
    setName('');
    setSlogan('');
    setGender('');
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

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onHide}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Add Candidate</button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
