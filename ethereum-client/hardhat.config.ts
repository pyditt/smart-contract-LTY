import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3'; // for tests only
import '@typechain/hardhat';
import { HardhatUserConfig, task, types } from 'hardhat/config';

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

task('deploy-ledgity')
  .addParam('uniswapRouter', 'Uniswap V2 router address', undefined, types.string)
  .addParam('usdc', 'USDC token address', undefined, types.string)
  .setAction(async (args, { ethers }) => {
    const ledgity = await (await ethers.getContractFactory('Ledgity')).deploy();
    const reserve = await (await ethers.getContractFactory('Reserve')).deploy(args.uniswapRouter, ledgity.address, args.usdc);
    await ledgity.initialize(args.uniswapRouter, reserve.address, args.usdc);
    console.log('Ledgity:', ledgity.address);
    console.log('Reserve:', reserve.address);
  });

task('deploy-test-environment', 'Setup test environment for testing purposes', async (args, { ethers }) => {
  const { deployUniswap } = await import('./shared/utils');
  const [signer] = await ethers.getSigners();
  const { factory, router, weth } = await deployUniswap(signer);
  console.log('Factory:', factory.address);
  console.log('Router:', router.address);
  console.log('WETH:', weth.address);
  const mockUsdc = await (await ethers.getContractFactory('MockUSDC')).deploy();
  console.log('Mock USDC:', mockUsdc.address);
});
