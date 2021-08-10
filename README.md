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
