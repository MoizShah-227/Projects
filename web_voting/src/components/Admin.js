import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import voteAbi from '../abi/VoteChain.json';
import AddCandidateModal from '../components/AddCandidateModal';
import SetVotingTimeModal from '../components/SetVotingTimeModal';

const contractAddress = "0xBE7DA091f727239b3edefd259195630c906c6274";

const Admin = () => {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [disableSetTime, setDisableSetTime] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const signer = await prov.getSigner();
        const address = await signer.getAddress();

        const contract = new ethers.Contract(contractAddress, voteAbi.abi, signer);
        setProvider(prov);
        setSigner(signer);
        setContract(contract);
        setUserAddress(address);

        const start = await contract.startTime();
        const end = await contract.endTime();
        const now = Math.floor(Date.now() / 1000);

        if (start > 0 && now < end) {
          setDisableSetTime(true);
          updateCountdown(end);
        }
      }
    };
    init();
  }, []);

  // Countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown && countdown > 0) {
        setCountdown(prev => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const updateCountdown = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    if (remaining > 0) {
      setCountdown(remaining);
    } else {
      setCountdown(null);
    }
  };

  const formatCountdown = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Auto End Voting When Time Ends
  useEffect(() => {
  let hasEnded = false; // ✅ Control flag outside interval

  const interval = setInterval(async () => {
    if (contract && !hasEnded) {
      try {
        const end = await contract.endTime();
        const votingStatus = await contract.votingEnded();
        const now = Math.floor(Date.now() / 1000);

        if (now > Number(end) && !votingStatus) {
          console.log("⌛ Voting should end now.");

          // Only call transaction once
          hasEnded = true;

          const nowDate = new Date();
          const day = nowDate.toLocaleDateString('en-US', { weekday: 'long' });
          const date = nowDate.toISOString().split('T')[0];

          const tx = await contract.checkAndEndVoting(day, date);
          await tx.wait();

          console.log("✅ Voting ended automatically.");
          setCountdown(null);
          setDisableSetTime(false);
        }
      } catch (e) {
        console.log("⚠️ Auto-end error:", e.reason || e.message);
      }
    }
  }, 10000);

  return () => clearInterval(interval);
}, [contract]);

  const addCandidate = async (name, slogan) => {
    try {
      const tx = await contract.addCandidate(name, slogan);
      await tx.wait();
      alert("✅ Candidate added!");
      setShowModal(false);
    } catch (err) {
      alert("❌ Failed to add candidate.");
    }
  };

  const setVotingTime = async (start, end) => {
    try {
      const tx = await contract.setVotingTime(start, end);
      await tx.wait();
      alert("✅ Voting time set!");
      setDisableSetTime(true);
      updateCountdown(end);
    } catch (err) {
      alert("❌ Failed to set voting time.");
      console.error(err);
    }
  };

  const loadCandidates = async () => {
    const count = await contract.getTotalCandidates();
    const list = [];
    for (let i = 1; i <= count; i++) {
      const c = await contract.getCandidate(i);
      list.push({ id: i, name: c[0], slogan: c[1], votes: c[2] });
    }
    setCandidates(list);
  };

  const loadHistory = async () => {
    const count = await contract.getElectionHistoryCount();
    const all = [];
    for (let i = 0; i < count; i++) {
      const r = await contract.getElectionResult(i);
      all.push({
        index: i + 1,
        start: new Date(r[0] * 1000).toLocaleString(),
        end: new Date(r[1] * 1000).toLocaleString(),
        day: r[2],
        date: r[3],
        totalVotes: r[4].toString(),
        winnerId: r[5].toString(),
        winnerName: r[6],
        winnerVotes: r[7].toString(),
      });
    }
    setHistory(all);
  };

  return (
    <div style={{ padding: "2rem", fontWeight: 400 }}>
      <h1>🗳️ VoteChain dApp</h1>
      <p>Connected as: {userAddress}</p>

      {countdown && (
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#2c3e50" }}>
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
      {candidates.map(c => (
        <div key={c.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <h3>#{c.id} - {c.name}</h3>
          <p>{c.slogan}</p>
          <strong>Votes: {c.votes.toString()}</strong>
        </div>
      ))}

      <hr />
      {history.map(e => (
        <div key={e.index} style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
          <h3>📅 Election #{e.index} ({e.day}, {e.date})</h3>
          <p>🕒 Start: {e.start}</p>
          <p>🕓 End: {e.end}</p>
          <p>🧾 Total Votes: {e.totalVotes}</p>
          <p>🏆 Winner: {e.winnerName} (ID: {e.winnerId}) with {e.winnerVotes} votes</p>
        </div>
      ))}

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
