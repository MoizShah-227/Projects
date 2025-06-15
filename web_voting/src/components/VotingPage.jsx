import React, { useState, useEffect } from 'react';
import logo from '../img/logo 1.png';
import './loginpage.css';
import './voting.css';
import candidate1 from '../img/logo 1.png';
import candidate2 from '../img/logo 1.png';
import candidate3 from '../img/logo 1.png';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import VoteChainABI from '../abi/VoteChain.json';

const contractAddress = '0xYourContractAddressHere';

const VotingPage = () => {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const navigate = useNavigate();

  const candidates = [
    { id: 1, name: 'Ali Raza', slogan: 'Transparency & Trust', img: candidate1 },
    { id: 2, name: 'Fatima Khan', slogan: 'Empowering Every Voice', img: candidate2 },
    { id: 3, name: 'Usman Tariq', slogan: 'Leading with Integrity', img: candidate3 },
  ];

  useEffect(() => {
    // Get CNIC from localStorage on load
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCnic(user.cnic);
    }
  }, []);

  const handleVoteClick = async () => {
    if (!selected) return alert('Please select a candidate.');

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address); // ✅ Save to state
        setShowModal(true); // ✅ Show modal after wallet connected
        console.log("Wallet address:", address);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      alert('Failed to connect wallet.');
    }
  };

  const confirmVote = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, VoteChainABI, signer);

      const tx = await contract.vote(selected.id, cnic);
      await tx.wait();

      alert(`✅ Voted for ${selected.name}`);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('❌ Voting failed. Check if you’ve already voted or try again.');
    }
  };

  const logout = () => {
    localStorage.clear();
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="voting-page">
      <nav className="nav">
        <div className="contain-nav">
          <div>
            <img src={logo} alt="logo" />
            <h4>VoteChain</h4>
          </div>
          <div>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="voting-body container">
        <h2 className="vote-heading">Click Below to Vote with Confidence!</h2>
        <div className="row candidate-cards">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`col-lg-4 col-sm-12 candidate-card ${selected?.id === candidate.id ? 'selected' : ''}`}
              onClick={() => setSelected(candidate)}
            >
              <img src={candidate.img} alt={candidate.name} />
              <h3>{candidate.name}</h3>
              <p>{candidate.slogan}</p>
            </div>
          ))}
        </div>

        <button className="btn vote-btn" onClick={handleVoteClick}>Vote</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="vote-modal">
          <div className="modal-content">
            <h2>Confirm Your Vote</h2>
            <p><strong>Selected Candidate:</strong> {selected.name}</p>
            <p><strong>Your CNIC:</strong> {cnic}</p>
            <p><strong>Wallet Address:</strong> {walletAddress}</p>
            <button className="btn" onClick={confirmVote}>Confirm Vote</button>
            <button className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
