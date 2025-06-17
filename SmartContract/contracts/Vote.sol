// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vote{

    struct Candidate {
        uint id;
        string name;
        string slogan;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        string cnic;
    }

    address public admin;
    uint public candidateCount;
    uint public totalVotes;
    uint public startTime;
    uint public endTime;

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(string => bool) private usedCNICs; // Prevent double voting by CNIC

    event VoteCasted(address indexed voter, uint candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyDuringVoting() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is not active.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Admin can set voting time window
    function setVotingTime(uint _startTime, uint _endTime) public onlyAdmin {
        require(_startTime < _endTime, "Start time must be before end time.");
        startTime = _startTime;
        endTime = _endTime;
    }

    // Add candidate (only admin)
    function addCandidate(string memory _name, string memory _slogan) public onlyAdmin {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, _slogan, 0);
    }

    // Vote for a candidate
    function vote(uint _candidateId, string memory _cnic) public onlyDuringVoting {
        require(!voters[msg.sender].hasVoted, "You have already voted with this wallet.");
        require(!usedCNICs[_cnic], "This CNIC has already been used to vote.");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        // Record the vote
        voters[msg.sender] = Voter(true, _cnic);
        usedCNICs[_cnic] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    // Get candidate details
    function getCandidate(uint _id) public view returns (string memory, string memory, uint) {
        Candidate memory c = candidates[_id];
        return (c.name, c.slogan, c.voteCount);
    }

    // Get total candidates
    function getTotalCandidates() public view returns (uint) {
        return candidateCount;
    }

    // Check if a user has voted
    function hasVoted(address _user) public view returns (bool) {
        return voters[_user].hasVoted;
    }

    // Admin can see voter's CNIC
    function getVoterCNIC(address _voter) public view onlyAdmin returns (string memory) {
        return voters[_voter].cnic;
    }

    // Get total votes cast
    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    // Get voting time window
    function getVotingTime() public view returns (uint, uint) {
        return (startTime, endTime);
    }
}
