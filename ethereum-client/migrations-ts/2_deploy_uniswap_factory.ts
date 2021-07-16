const UniswapV2Factory = artifacts.require('UniswapV2Factory');

const migration: Truffle.Migration = async function (deployer) {
  deployer.deploy(UniswapV2Factory, '0x0000000000000000000000000000000000000000');
};
module.exports = migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };
