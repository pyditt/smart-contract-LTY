# Ledgity

Working directory: `ethereum-client`.

## Setup project

Copy `env.example.ts` and rename it to `env.ts`. Fill in all the variables there.

Install dependencies

```sh
yarn install
```

Additionally [install](https://hardhat.org/guides/shorthand.html) `hh` shortcut to save some typing.
`hh` is equivalent to `yarn hardhat`.

```sh
yarn global add hardhat-shorthand
```

## Compile contracts

```sh
hh compile
```

## Run tests

```sh
hh test
```

To run tests faster(by skipping the typechecking step):

```sh
TS_NODE_TRANSPILE_ONLY=1 hh test
```

## Run tests with coverage

```sh
hh coverage
```

Open `coverage/index.html` in the browser.

## Auto audit with slither

To audit all contracts, use the command :

```sh
slither .
```

To exclude warnings in subsequent audits, use :

```sh
slither . --triage
```

## Deploy

You should specify the network you want to deploy to. Replace `<network>` in any of the commands below with
the network of your choice(e.g., `ropsten`).

### Deploy Ledgity

```sh
hh --network <network> deploy --tags ledgity
```

### Price Oracle

Before deploying price oracle, you MUST add liquidity to the uniswap pair. After you added liquidity:

```sh
hh --network <network> deploy --tags price-oracle
```

### Ledgity Router

Ledgity Router allows users to add liquidity bypassing fees.

```sh
hh --network <network> deploy --tags ledgity-router
```
## Verify

You should specify the network you want to verify to. Replace `<network>` in any of the commands below with
the network of your choice(e.g., `ropsten`).


```sh
hh verify --network <network> DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Argument 2"
```


## Docs

You can create documentation for the code automatically.


```sh
npx solidity-docgen -t ./docs/templates/ -s single
```
