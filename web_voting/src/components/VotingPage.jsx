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

const contractAddress = '0xDD92959026E35A0D225C4B57B53Aa0a2142E7e7C';

const VotingPage = () => {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get CNIC from localStorage on load
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setCnic(user.cnic);

    // Fetch candidates from smart contract
    const fetchCandidates = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, VoteChainABI, signer);

          const count = await contract.getTotalCandidates();
          const list = [];

          for (let i = 1; i <= count; i++) {
            const c = await contract.getCandidate(i);
            list.push({
              id: i,
              name: c[0],
              slogan: c[1],
              votes: c[2].toString(),
              img: i === 1 ? candidate1 : i === 2 ? candidate2 : candidate3 // Optional image logic
            });
          }
          console.log(list)
          setCandidates(list);
        }
      } catch (error) {
        console.error("Error loading candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleVoteClick = async () => {
    if (!selected) return alert('Please select a candidate.');

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setWalletAddress(address);

        // Show confirmation modal
        setTimeout(() => {
          setShowModal(true);
        }, 100);
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
          {candidates.length === 0 ? (
            <p>Loading candidates...</p>
          ) : (
            candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`col-lg-4 col-sm-12 candidate-card ${selected?.id === candidate.id ? 'selected' : ''}`}
                onClick={() => setSelected(candidate)}
              >
                <img src={candidate.img} alt={candidate.name} />
                <h3>{candidate.name}</h3>
                <p>{candidate.slogan}</p>
              </div>
            ))
          )}
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
