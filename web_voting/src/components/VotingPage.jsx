import React, { useState, useEffect } from 'react';
import logo from '../img/logo 1.png';
import './loginpage.css';
import './voting.css';
import candidate1 from '../img/avatar.png';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from 'wagmi';
import VoteChainABI from '../abi/VoteChain.json';
import LandingAnimation from './LoadingAnimation';

const VotingPage = () => {
  const contractAddress = '0x74676c425f16c630ceA325CDB1386042Ca39Cc96';
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cnic, setCnic] = useState('');
  const [user, setUser] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingStatus, setVotingStatus] = useState('loading');
  const [electionName, setElectionName] = useState('');

  const navigate = useNavigate();
  const { address: walletAddress, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: startTimeData } = useReadContract({
    address: contractAddress,
    abi: VoteChainABI.abi,
    functionName: 'startTime',
    watch: true,
  });

  const { data: endTimeData } = useReadContract({
    address: contractAddress,
    abi: VoteChainABI.abi,
    functionName: 'endTime',
    watch: true,
  });

  const { data: rawElectionName } = useReadContract({
    address: contractAddress,
    abi: VoteChainABI.abi,
    functionName: 'electionName',
    watch: true,
  });

  useEffect(() => {
    if (rawElectionName) {
      const clean = rawElectionName.replace(/\0/g, '');
      setElectionName(clean);
    }
  }, [rawElectionName]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUser(user?.gender);
    if (user?.cnic) setCnic(user.cnic);
  }, []);

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchEndY - touchStartY;

      if (swipeDistance > 70 && window.scrollY === 0) {
        window.location.reload();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const loadCandidates = async () => {
      if (!publicClient || !startTimeData || !endTimeData) return;

      const now = Math.floor(Date.now() / 1000);
      const start = Number(startTimeData);
      const end = Number(endTimeData);

      if (now < start) {
        setVotingStatus('notStarted');
      } else if (now >= start && now <= end) {
        setVotingStatus('inProgress');
        try {
          const count = Number(
            await publicClient.readContract({
              address: contractAddress,
              abi: VoteChainABI.abi,
              functionName: 'getTotalCandidates',
            })
          );

          const list = [];
          for (let i = 1; i <= count; i++) {
            const c = await publicClient.readContract({
              address: contractAddress,
              abi: VoteChainABI.abi,
              functionName: 'getCandidate',
              args: [i],
            });

            list.push({
              id: i,
              name: c[0],
              slogan: c[1],
              gender: c[2],
              votes: c[3].toString(),
              img: candidate1,
            });
          }
          setCandidates(list);
        } catch (err) {
          console.error('Failed to load candidates', err);
          alert('❌ Could not load candidates.');
        }
      } else {
        setVotingStatus('ended');
      }
    };

    loadCandidates();
  }, [publicClient, startTimeData, endTimeData]);

  const handleVoteClick = () => {
    if (!selected) return alert('Please select a candidate.');

    if (selected.gender === user) {
      setShowModal(true);
    } else {
      alert(`❌ You can only vote for candidates of your gender (${user}).`);
    }
  };

  const confirmVote = async () => {
    if (!selected || !cnic || !isConnected) return;

    setLoading(true);
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = Number(startTimeData);
      const end = Number(endTimeData);

      if (now < start || now > end) {
        alert('❌ Voting is not allowed at this time.');
        setShowModal(false);
        return;
      }

      await writeContractAsync({
        address: contractAddress,
        abi: VoteChainABI.abi,
        functionName: 'vote',
        args: [selected.id, cnic],
      });

      alert(`✅ Voted for ${selected.name}`);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      if (err?.message?.includes('already voted')) {
        alert('❌ You have already voted with this wallet or CNIC.');
      } else {
        alert('❌ Voting failed. Please try again.');
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
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="voting-body container">
          <h2 className="vote-heading">Vote with Confidence!</h2>
          <div className="connect-btn">
            <ConnectButton />
          </div>

          {electionName && (
            <p
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#0f5132',
              }}
            >
              🗳️ Current Election: <strong>{electionName}</strong>
            </p>
          )}

          {votingStatus === 'loading' && <p>Checking voting status...</p>}
          {votingStatus === 'notStarted' && (
            <p style={{ fontSize: '1.2rem', color: 'red' }}>
              🕐 Voting has not started yet.
            </p>
          )}
          {votingStatus === 'ended' && (
            <p style={{ fontSize: '1.2rem', color: 'red' }}>
              ✅ Voting has ended. Thank you for your interest.
            </p>
          )}

          {votingStatus === 'inProgress' && (
            <>
              <div className="row candidate-cards">
                {candidates.length === 0 ? (
                  <p>Loading candidates...</p>
                ) : (
                  candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`col-lg-4 col-sm-12 candidate-card ${
                        selected?.id === candidate.id ? 'selected' : ''
                      }`}
                      onClick={() => setSelected(candidate)}
                    >
                      <img src={candidate.img} alt={candidate.name} />
                      <h3>{candidate.name}</h3>
                      <h4>{candidate.slogan}</h4>
                      <p>{candidate.gender}</p>
                    </div>
                  ))
                )}
              </div>
              <button className="btn vote-btn" onClick={handleVoteClick}>
                Vote
              </button>
            </>
          )}
        </div>

        {showModal && selected && (
          <div className="vote-modal">
            <div className="modal-content">
              <h2>Confirm Your Vote</h2>
              <p>
                <strong>Selected Candidate:</strong> {selected.name}
              </p>
              <p>
                <strong>Your CNIC:</strong> {cnic}
              </p>
              <p>
                <strong>Wallet Address:</strong> {walletAddress}
              </p>
              <button className="btn" onClick={confirmVote} disabled={loading}>
                {loading ? 'Submitting...' : 'Confirm Vote'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VotingPage;
