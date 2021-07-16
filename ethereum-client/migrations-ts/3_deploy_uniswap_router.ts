const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');
const WETH = artifacts.require('WETH9');

const migration: Truffle.Migration = async function (deployer) {
  const factory = await UniswapV2Factory.deployed();
  await deployer.deploy(WETH);
  const weth = await WETH.deployed();
  await deployer.deploy(UniswapV2Router02, factory.address, weth.address);
};
module.exports = migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };
