import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import voteAbi from '../abi/VoteChain.json';

const contractAddress = "0xDD92959026E35A0D225C4B57B53Aa0a2142E7e7C";

const Admin = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const signer = await prov.getSigner();
        const address = await signer.getAddress();

        const contract = new ethers.Contract(contractAddress, voteAbi, signer);
        console.log(contract)
        setProvider(prov);
        setSigner(signer);
        setContract(contract);
        setUserAddress(address);
      }
    };

    init();
  }, []);

  // Add a candidate
  const addCandidate = async () => {
    const name = prompt("Candidate Name:");
    const slogan = prompt("Candidate Slogan:");
    const tx = await contract.addCandidate(name, slogan);
    await tx.wait();
    alert("Candidate added");
  };

  // Set voting time
  const setVotingTime = async () => {
    const start = Math.floor(Date.now() / 1000); // now
    const end = start + 3600; // 1 hour later
    const tx = await contract.setVotingTime(start, end);
    await tx.wait();
    alert("Voting time set!");
  };

  // Vote
  const vote = async () => {
    const id = prompt("Enter Candidate ID:");
    const cnic = prompt("Enter Your CNIC:");
    const tx = await contract.vote(id, cnic);
    await tx.wait();
    alert("Vote casted!");
  };

  // Fetch all candidates
  const loadCandidates = async () => {
    const count = await contract.getTotalCandidates();
    const list = [];
    for (let i = 1; i <= count; i++) {
      const c = await contract.getCandidate(i);
      list.push({ id: i, name: c[0], slogan: c[1], votes: c[2] });
    }
    setCandidates(list);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🗳️ VoteChain dApp</h1>
      <p>Connected as: {userAddress}</p>

      <button onClick={addCandidate}>➕ Add Candidate</button>
      <button onClick={setVotingTime}>⏰ Set Voting Time</button>
      <button onClick={vote}>🗳️ Vote</button>
      <button onClick={loadCandidates}>📋 Load Candidates</button>

      <hr />
      {candidates.map(c => (
        <div key={c.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <h3>#{c.id} - {c.name}</h3>
          <p>{c.slogan}</p>
          <strong>Votes: {c.votes.toString()}</strong>
        </div>
      ))}
    </div>
  );
};

export default Admin;
