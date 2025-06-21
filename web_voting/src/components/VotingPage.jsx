import React, { useState, useEffect } from 'react';
import logo from '../img/logo 1.png';
import './loginpage.css';
import './voting.css';
import candidate1 from '../img/avatar.png';
import candidate2 from '../img/avatar.png';
import candidate3 from '../img/avatar.png';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import VoteChainABI from '../abi/VoteChain.json';
import LandingAnimation from './LoadingAnimation';

const contractAddress = '0xBE7DA091f727239b3edefd259195630c906c6274';

const VotingPage = () => {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [votingStatus, setVotingStatus] = useState('loading'); // loading, notStarted, inProgress, ended
  const navigate = useNavigate();

  // Connect wallet & fetch candidates + voting status
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.cnic) setCnic(user.cnic);

    const init = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          setWalletAddress(address);
          const voteContract = new ethers.Contract(contractAddress, VoteChainABI.abi, signer);
          setContract(voteContract);

          const now = Math.floor(Date.now() / 1000);
          const start = await voteContract.startTime();
          const end = await voteContract.endTime();

          if (now < start) {
            setVotingStatus('notStarted');
          } else if (now >= start && now <= end) {
            setVotingStatus('inProgress');

            const count = await voteContract.getTotalCandidates();
            const list = [];
            for (let i = 1; i <= count; i++) {
              const c = await voteContract.getCandidate(i);
              list.push({
                id: i,
                name: c[0],
                slogan: c[1],
                votes: c[2].toString(),
                img: i === 1 ? candidate1 : i === 2 ? candidate2 : candidate3
              });
            }
            setCandidates(list);
          } else {
            setVotingStatus('ended');
          }
        } else {
          alert("MetaMask not found!");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        alert("Failed to load voting data.");
      }
    };

    init();
  }, []);

  const handleVoteClick = () => {
    if (!selected) return alert('Please select a candidate.');
    setShowModal(true);
  };

  const confirmVote = async () => {
    if (!contract || !cnic || !selected) return;

    setLoading(true);
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = await contract.startTime();
      const end = await contract.endTime();

      if (now < start || now > end) {
        alert("❌ Voting is not allowed at this time.");
        setShowModal(false);
        return;
      }

      const tx = await contract.vote(selected.id, cnic);
      await tx.wait();

      alert(`✅ Voted for ${selected.name}`);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      if (err?.reason?.includes("already voted") || err?.message?.includes("already voted")) {
        alert("❌ You have already voted with this wallet or CNIC.");
      } else {
        alert("❌ Voting failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      {loading && <LandingAnimation />}

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
          <h2 className="vote-heading">Vote with Confidence!</h2>

          {votingStatus === 'loading' && <p>Checking voting status...</p>}
          {votingStatus === 'notStarted' && <p style={{ fontSize: "1.2rem", color: "red" }}>🕐 Voting has not started yet.</p>}
          {votingStatus === 'ended' && <p style={{ fontSize: "1.2rem", color: "red" }}>✅ Voting has ended. Thank you for your interest.</p>}
          {votingStatus === 'inProgress' && (

            <>
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
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && selected && (
          <div className="vote-modal">
            <div className="modal-content">
              <h2>Confirm Your Vote</h2>
              <p><strong>Selected Candidate:</strong> {selected.name}</p>
              <p><strong>Your CNIC:</strong> {cnic}</p>
              <p><strong>Wallet Address:</strong> {walletAddress}</p>
              <button className="btn" onClick={confirmVote} disabled={loading}>
                {loading ? 'Submitting...' : 'Confirm Vote'}
              </button>
              <button className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VotingPage;
