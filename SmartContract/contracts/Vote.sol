// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vote {
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

    struct ElectionResult {
        uint startTime;
        uint endTime;
        string day;
        string date;
        uint totalVotes;
        uint winnerId;
        string winnerName;
        uint winnerVotes;
    }

    address public admin;
    uint public candidateCount;
    uint public totalVotes;
    uint public startTime;
    uint public endTime;
    bool public votingEnded;

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(string => bool) private usedCNICs;

    address[] public voterAddresses;      // Track who voted
    string[] public usedCnicList;         // Track which CNICs were used

    ElectionResult[] public history;

    event VoteCasted(address indexed voter, uint candidateId);
    event VotingEnded(ElectionResult result);

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

    function setVotingTime(uint _startTime, uint _endTime) public onlyAdmin {
        require(_startTime < _endTime, "Start time must be before end time.");
        startTime = _startTime;
        endTime = _endTime;
        votingEnded = false;
        totalVotes = 0;

        // Reset previous candidates
        for (uint i = 1; i <= candidateCount; i++) {
            delete candidates[i];
        }
        candidateCount = 0;

        // Reset voter addresses and records
        for (uint i = 0; i < voterAddresses.length; i++) {
            delete voters[voterAddresses[i]];
        }
        delete voterAddresses;

        // Reset CNICs
        for (uint i = 0; i < usedCnicList.length; i++) {
            delete usedCNICs[usedCnicList[i]];
        }
        delete usedCnicList;
    }

    function addCandidate(string memory _name, string memory _slogan) public onlyAdmin {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, _slogan, 0);
    }

    function vote(uint _candidateId, string memory _cnic) public onlyDuringVoting {
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        require(!usedCNICs[_cnic], "This CNIC has already been used.");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        voters[msg.sender] = Voter(true, _cnic);
        usedCNICs[_cnic] = true;
        usedCnicList.push(_cnic);
        voterAddresses.push(msg.sender);

        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    function checkAndEndVoting(string memory _day, string memory _date) public {
        if (block.timestamp > endTime && !votingEnded) {
            uint maxVotes = 0;
            uint winnerId = 0;

            for (uint i = 1; i <= candidateCount; i++) {
                if (candidates[i].voteCount > maxVotes) {
                    maxVotes = candidates[i].voteCount;
                    winnerId = i;
                }
            }

            ElectionResult memory result = ElectionResult({
                startTime: startTime,
                endTime: endTime,
                day: _day,
                date: _date,
                totalVotes: totalVotes,
                winnerId: winnerId,
                winnerName: candidates[winnerId].name,
                winnerVotes: candidates[winnerId].voteCount
            });

            history.push(result);
            votingEnded = true;

            emit VotingEnded(result);

            // ✅ Reset data after saving result
            for (uint i = 1; i <= candidateCount; i++) {
                delete candidates[i];
            }
            candidateCount = 0;

            for (uint i = 0; i < voterAddresses.length; i++) {
                delete voters[voterAddresses[i]];
            }
            delete voterAddresses;

            for (uint i = 0; i < usedCnicList.length; i++) {
                delete usedCNICs[usedCnicList[i]];
            }
            delete usedCnicList;
        }
    }

    function getElectionHistoryCount() public view returns (uint) {
        return history.length;
    }

    function getElectionResult(uint index) public view returns (
        uint, uint, string memory, string memory, uint, uint, string memory, uint
    ) {
        require(index < history.length, "Invalid index.");
        ElectionResult memory r = history[index];
        return (
            r.startTime,
            r.endTime,
            r.day,
            r.date,
            r.totalVotes,
            r.winnerId,
            r.winnerName,
            r.winnerVotes
        );
    }

    function getTotalCandidates() public view returns (uint) {
        return candidateCount;
    }

    function getCandidate(uint _id) public view returns (string memory, string memory, uint) {
        require(_id > 0 && _id <= candidateCount, "Invalid candidate ID");
        Candidate memory c = candidates[_id];
        return (c.name, c.slogan, c.voteCount);
    }
}
