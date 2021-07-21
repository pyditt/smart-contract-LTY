const Ledgity = artifacts.require('Ledgity');
const Reserve = artifacts.require('Reserve');
const MockUSDC = artifacts.require('MockUSDC');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');

const migration: Truffle.Migration = async function (deployer) {
  const router = await UniswapV2Router02.deployed();
  await deployer.deploy(MockUSDC);
  const ledgity = await Ledgity.deployed();
  const usdc = await MockUSDC.deployed();
  await deployer.deploy(Reserve, router.address, ledgity.address, usdc.address);
};
module.exports = migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };
