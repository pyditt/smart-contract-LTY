import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3'; // for tests only
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.6.12',
  typechain: {
    externalArtifacts: [
      './uniswap_build/**/*.json',
    ],
  },
};

export default config;
