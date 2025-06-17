// ignition/modules/vote.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VoteModule = buildModule("VoteModule", (m) => {
  const voteChain = m.contract("Vote");

  return { voteChain };
});

export default VoteModule;  