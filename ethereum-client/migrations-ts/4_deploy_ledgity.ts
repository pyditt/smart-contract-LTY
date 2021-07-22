const Ledgity = artifacts.require('Ledgity');

const migration: Truffle.Migration = async function (deployer) {
  await deployer.deploy(Ledgity);
};
module.exports = migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { };
