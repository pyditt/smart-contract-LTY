const Ledgity = artifacts.require('Ledgity');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');

const migration: Truffle.Migration = async function (deployer) {
  const router = await UniswapV2Router02.deployed();
  await deployer.deploy(Ledgity, router.address);
};
module.exports = migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };
