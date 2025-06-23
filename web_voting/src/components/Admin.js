import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import voteAbi from '../abi/VoteChain.json';
import AddCandidateModal from '../components/AddCandidateModal';
import SetVotingTimeModal from '../components/SetVotingTimeModal';
import LandingAnimation from './LoadingAnimation';
const contractAddress = '0xBE7DA091f727239b3edefd259195630c906c6274';

const Admin = () => {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [history, setHistory] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [disableSetTime, setDisableSetTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const { address: userAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  console.log(publicClient)

  const { writeContract } = useWriteContract();

  const { data: startTime } = useReadContract({
    address: contractAddress,
    abi: voteAbi.abi,
    functionName: 'startTime',
    watch: true,
  });

  const { data: endTime } = useReadContract({
    address: contractAddress,
    abi: voteAbi.abi,
    functionName: 'endTime',
    watch: true,
  });

  const updateCountdown = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    setCountdown(remaining > 0 ? remaining : null);
  };

  useEffect(() => {
    if (startTime && endTime) {
      const now = Math.floor(Date.now() / 1000);
      if (now < Number(endTime)) {
        setDisableSetTime(true);
        updateCountdown(Number(endTime));
      }
    }
  }, [startTime, endTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!publicClient || hasEnded || !endTime || !isConnected) return;

      const now = Math.floor(Date.now() / 1000);

      const votingStatus = await publicClient.readContract({
        address: contractAddress,
        abi: voteAbi.abi,
        functionName: 'votingEnded',
      });

      if (now > Number(endTime) && !votingStatus) {
        setHasEnded(true);
        setLoading(true);

        const nowDate = new Date();
        const day = nowDate.toLocaleDateString('en-US', { weekday: 'long' });
        const date = nowDate.toISOString().split('T')[0];

        try {
          await writeContract({
            address: contractAddress,
            abi: voteAbi.abi,
            functionName: 'checkAndEndVoting',
            args: [day, date],
          });
          setCountdown(null);
          setDisableSetTime(false);
        } catch (e) {
          console.error('Auto-end error:', e.message);
        } finally {
          setLoading(false);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [publicClient, hasEnded, endTime, isConnected]);

  const addCandidate = async (name, slogan) => {
    setLoading(true);
    try {
      await writeContract({
        address: contractAddress,
        abi: voteAbi.abi,
        functionName: 'addCandidate',
        args: [name, slogan],
      });
      alert('✅ Candidate added!');
      setShowModal(false);
      
    } catch {
      alert('❌ Failed to add candidate.');
    }finally{
      setLoading(false);
    }
  };

  const setVotingTime = async (start, end) => {
    setLoading(true);
    try {
      await writeContract({
        address: contractAddress,
        abi: voteAbi.abi,
        functionName: 'setVotingTime',
        args: [start, end],
      });
      alert('✅ Voting time set!');
      setDisableSetTime(true);
      updateCountdown(end);
    } catch {
      alert('❌ Failed to set voting time.');
    } finally {
      setLoading(false);
    }
  };

const loadCandidates = async () => {
  if (!publicClient) return;
  setLoading(true);
  setHistory([]); // 👈 Clear election history before loading candidates
  try {
    const countBigInt = await publicClient.readContract({
      address: contractAddress,
      abi: voteAbi.abi,
      functionName: 'getTotalCandidates',
    });

    const count = Number(countBigInt);
    const list = [];

    for (let i = 1; i <= count; i++) {
      const c = await publicClient.readContract({
        address: contractAddress,
        abi: voteAbi.abi,
        functionName: 'getCandidate',
        args: [i],
      });

      list.push({
        id: i,
        name: c[0],
        slogan: c[1],
        votes: c[2].toString(),
      });
    }

    setCandidates(list);
  } catch (err) {
    console.error("Load candidate error:", err);
    alert('❌ Error loading candidates.');
  } finally {
    setLoading(false);
  }
};


const loadHistory = async () => {
  if (!publicClient) return;
  setLoading(true);
  setCandidates([]); // 👈 Clear candidates list before loading history
  try {
    const countBigInt = await publicClient.readContract({
      address: contractAddress,
      abi: voteAbi.abi,
      functionName: 'getElectionHistoryCount',
    });

    const count = Number(countBigInt);
    const all = [];

    for (let i = 0; i < count; i++) {
      const r = await publicClient.readContract({
        address: contractAddress,
        abi: voteAbi.abi,
        functionName: 'getElectionResult',
        args: [i],
      });

      all.push({
        index: i + 1,
        start: new Date(Number(r[0]) * 1000).toLocaleString(),
        end: new Date(Number(r[1]) * 1000).toLocaleString(),
        day: r[2],
        date: r[3],
        totalVotes: r[4].toString(),
        winnerId: r[5].toString(),
        winnerName: r[6],
        winnerVotes: r[7].toString(),
      });
    }

    setHistory(all);
  } catch (err) {
    console.error("Load history error:", err);
    alert('❌ Error loading election history.');
  } finally {
    setLoading(false);
  }
};

  const formatCountdown = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="admin">
      {loading && <LandingAnimation />}

      <div style={{ padding: '2rem', fontWeight: 500 }}>
        <a href='/'>Back to home</a>
        <ConnectButton />
        <h1>🗳️ VoteChain dApp</h1>

        {userAddress && <p>Connected as: {userAddress} </p>}
        {countdown > 0 && (
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#07090a'  }}>
            ⏳ Voting ends in: {formatCountdown(countdown)}
          </p>
        )}

        <button onClick={() => setShowModal(true)}>➕ Add Candidate</button>
        <button onClick={() => setShowTimeModal(true)} disabled={disableSetTime}>
          ⏰ Set Voting Time
        </button>
        <button onClick={loadCandidates}>📋 Load Candidates</button>
        <button onClick={loadHistory}>📊 Election History</button>
        
        <hr />
        {candidates.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h3>#{c.id} - {c.name}</h3>
            <p>{c.slogan}</p>
            <strong>Votes: {c.votes.toString()}</strong>
          </div>
        ))}

        <hr />
        {history.map((e) => (
          <div key={e.index} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
            <h3>📅 Election #{e.index} ({e.day}, {e.date})</h3>
            <p>🕒 Start: {e.start}</p>
            <p>🕓 End: {e.end}</p>
            <p>🧾 Total Votes: {e.totalVotes}</p>
            <p>🏆 Winner: {e.winnerName} (ID: {e.winnerId}) with {e.winnerVotes} votes</p>
          </div>
        ))}
      </div>

      <AddCandidateModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={addCandidate}
      />
      <SetVotingTimeModal
        show={showTimeModal}
        onHide={() => setShowTimeModal(false)}
        onSubmit={setVotingTime}
      />

    </div>
  );
};

export default Admin;
