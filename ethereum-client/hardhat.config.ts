import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3'; // for tests only
import '@typechain/hardhat';
import { HardhatUserConfig, task } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.6.12',
  networks: {
    private: {
      url: 'http://52.12.224.224:8545',
      chainId: 1337,
    },
  },
  typechain: {
    externalArtifacts: [
      './uniswap_build/**/*.json',
    ],
  },
};

export default config;

task('deploy-uniswap', async (args, { ethers }) => {
  const { deployUniswap } = await import('./shared/utils');
  const [signer] = await ethers.getSigners();
  const { factory, router, weth } = await deployUniswap(signer);
  console.log('Factory:', factory.address);
  console.log('Router:', router.address);
  console.log('WETH:', weth.address);
});
