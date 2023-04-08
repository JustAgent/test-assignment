import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  etherscan: {
    apiKey: "95F7P9IJIDI2WFUR5RCFSABD4P978N9QZ9",
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      accounts: [process.env.PK!],
    },
  },
};

export default config;
