const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

require("ts-node").register({
  files: true,
});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    test: {
      host: "127.0.0.1",
      port: "8545",
      network_id: "*",
      gas: 900000000,
    },
    kovan: {
      provider: () => new HDWalletProvider('c7bb7b0f60639c448b72aff4dfdf7fcc0dc57fe500cd7395bf574fd68db69cd3', 'wss://kovan.infura.io/ws/v3/18f8058e1af4440fa0273888772f6420'),
      network_id: 42,
      gasPrice: '75000000000',
      gas: 8000000,
      confirmations: 2,       // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 100000,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true        // Skip dry run before migrations? (default: false for public nets )
    },
    private: {
      host: '52.12.224.224',
      port: "8545",
      network_id: "1337",
      gas: 8000000,
      confirmations: 0,
      skipDryRun: true,        // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "0.6.12",
    },
  },
  plugins: [
    'truffle-contract-size',
  ],
};
