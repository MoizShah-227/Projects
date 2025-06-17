import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: ["081c3f66e73d95dfdb2e07fdd53bd26069267b6b1b2f497e0c1b97b12fc55647"],
    },
  },
};

export default config;