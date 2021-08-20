import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';
import { MAINNET_PRIVATE_KEY, MAINNET_PROVIDER_URL, PRIVATE_NETWORK_PRIVATE_KEY, ROPSTEN_PRIVATE_KEY, ROPSTEN_PROVIDER_URL } from './env';

function typedNamedAccounts<T>(namedAccounts: { [key in string]: T }) {
  return namedAccounts;
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    private: {
      url: 'http://52.12.224.224:8545',
      chainId: 1337,
      accounts: [PRIVATE_NETWORK_PRIVATE_KEY],
    },
    ropsten: {
      url: ROPSTEN_PROVIDER_URL,
      chainId: 3,
      accounts: [ROPSTEN_PRIVATE_KEY],
      gasPrice: 3000000000,
    },
    main: {
      url: MAINNET_PROVIDER_URL,
      chainId: 1,
      accounts: [MAINNET_PRIVATE_KEY],
      gasPrice: 40000000000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "TVHC8TX5TTYPBQFQ5E9GWT8QN74CSK5T3H",
  },
  namedAccounts: typedNamedAccounts({
    deployer: {
      private: 0,
      main: 0,
      ropsten: 0,
    },
    uniswapRouter: {
      private: '0xA526452c864437eaAB0858459720bE82d357fA80',
      main: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      ropsten: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    },
    usdc: {
      private: '0xEc6802f549BC3E99FF12aF779A8e0B90453864C1',
      main: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      ropsten: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    },
  }),
  typechain: {
    externalArtifacts: [
      './uniswap_build/**/*.json',
    ],
  },
  abiExporter: {
    path: './client/src/abi',
    flat: true,
    clear: true,
  },
};

export default config;

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
